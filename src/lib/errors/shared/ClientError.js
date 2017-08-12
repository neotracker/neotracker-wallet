/* @flow */
import BaseError from './BaseError';

const CLIENT_ERROR_PREFIX = 'CLIENT:';

export const COPY_UNSUPPORTED_BROWSER =
  'Copying to clipboard is not supported in your browser.';
export const SOMETHING_WENT_WRONG =
  'Something went wrong. Try refreshing the page or going back to where you ' +
  'were.';
export const NETWORK_ERROR =
  'Network failure. Try refreshing the page.';

export default class ClientError extends BaseError {
  clientMessage: string;

  constructor(message: string, data?: Object) {
    super(`${CLIENT_ERROR_PREFIX}${message}`, data);
    this.clientMessage = message;
  }

  static extractClientErrorMessage(message: string): ?string {
    if (message.startsWith(CLIENT_ERROR_PREFIX)) {
      return message.substr(CLIENT_ERROR_PREFIX.length);
    }

    return null;
  }

  static getClientError(error: Error): ?ClientError {
    const message = this.extractClientErrorMessage(error.message);
    if (message != null) {
      return new ClientError(message, { originalError: error });
    }

    return null;
  }

  // eslint-disable-next-line
  static getMessageForStatusCode(statusCode: number): string {
    // TODO: Make this better for each status code
    return SOMETHING_WENT_WRONG;
  }

  static async getFromResponse(response: Response): Promise<ClientError> {
    let originalMessage;
    let message;
    try {
      originalMessage = await response.text();
      message = this.extractClientErrorMessage(originalMessage);
    } catch (error) {
      // Do nothing
    }
    return new ClientError(
      message || this.getMessageForStatusCode(response.status),
      { originalMessage, statusCode: response.status },
    );
  }

  static getFromNetworkError(error: Error): ClientError {
    return new ClientError(
      NETWORK_ERROR,
      { originalError: error },
    );
  }
}
