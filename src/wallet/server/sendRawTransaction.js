/* @flow */
import type { Context } from 'koa';

import fetch from 'node-fetch';

import { ClientError } from '~/src/lib/errors/shared';
import { HTTPError } from '~/src/lib/errors/server';

import log from '~/src/shared/log';

type RPCURLFetcher = {
  +get: () => Promise<string>,
};

const PARSE_ERROR_CODE = -32700;
const PARSE_ERROR_MESSAGE = 'Parse error';
const request = async ({
  endpoint,
  body,
  timeoutMS,
  tries: triesIn,
}: {|
  endpoint: string,
  body: Object,
  timeoutMS?: number,
  tries?: number,
|}) => {
  const timeout = timeoutMS == null ? 5000 : timeoutMS;
  let tries = triesIn == null ? 0 : triesIn;
  let parseErrorTries = 3;
  let result;
  let finalError;
  while (tries >= 0) {
    try {
      // eslint-disable-next-line
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        timeout,
      });
      // eslint-disable-next-line
      result = await response.json();
      if (typeof result === 'object') {
        if (
          result.error &&
          result.error.code === PARSE_ERROR_CODE &&
          result.error.message === PARSE_ERROR_MESSAGE &&
          parseErrorTries > 0
        ) {
          tries += 1;
          parseErrorTries -= 1;
        } else {
          return result;
        }
      }
    } catch (error) {
      finalError = error;
    }

    tries -= 1;
  }
  if (finalError != null) {
    throw finalError;
  }

  throw new Error('Did not receive valid blockchain rpc response.');
};

const queryRPC = async ({
  endpoint,
  params,
  id: idIn,
}: {
  endpoint: string,
  params: Array<mixed>,
  id?: number,
}) => {
  const id = idIn == null ? 1 : idIn;
  const result = await request({
    endpoint,
    body: {
      jsonrpc: '2.0',
      method: 'sendrawtransaction',
      params,
      id,
    },
    tries: 1,
  });
  return result;
}

export default (getFetcher: () => RPCURLFetcher) =>
  async (ctx: Context): Promise<void> => {
    try {
      const { fields } = ctx.request;
      if (
        fields == null ||
        !Array.isArray(fields)
      ) {
        throw new HTTPError(
          400,
          HTTPError.PROGRAMMING_ERROR,
          HTTPError.ERROR_CODES[HTTPError.PROGRAMMING_ERROR],
        );
      }

      if (ctx.request.method !== 'POST') {
        throw new HTTPError(
          400,
          HTTPError.PROGRAMMING_ERROR,
          HTTPError.ERROR_CODES[HTTPError.PROGRAMMING_ERROR],
        );
      }

      const endpoint = await getFetcher().get();
      await queryRPC({
        endpoint,
        params: fields,
      });
      ctx.status = 200;
    } catch (error) {
      log({
        event: 'SEND_RAW_TRANSACTION_ERROR',
        meta: { type: 'error', error },
        context: ctx.state.loggingContext,
      });
      throw new ClientError('Failed to send transaction.');
    }
  }
