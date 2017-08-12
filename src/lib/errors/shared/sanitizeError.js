/* @flow */
import ClientError, {
  SOMETHING_WENT_WRONG
} from './ClientError';

export const sanitizeErrorNullable = (error: Error): ?ClientError => {
  if (error instanceof ClientError) {
    return error;
  }

  const clientError = ClientError.getClientError(error);
  if (clientError != null) {
    return clientError;
  }

  return null;
};

export const sanitizeError = (error: Error): ClientError => {
  const sanitizedError = sanitizeErrorNullable(error);
  return sanitizedError == null
    ? new ClientError(SOMETHING_WENT_WRONG)
    : sanitizedError;
};
