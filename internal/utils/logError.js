/* @flow */
import log from './log';

export default function logError({
  title,
  message,
  errorMessage,
  error,
  notify,
}: {
  title: string,
  message: string,
  errorMessage?: string,
  error?: Error,
  notify?: boolean,
}): void {
  log({
    title,
    message: `${message} Please check the console for more information.`,
    level: 'error',
    notify: notify == null ? true : notify,
  });
  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
  if (errorMessage) {
    log({
      title,
      message: errorMessage,
      level: 'error',
      notify: false,
    });
  }
}
