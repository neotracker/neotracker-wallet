/* @flow */
const RETRY_INTERVAL = 30000;
export default (retryInterval: number = RETRY_INTERVAL) => {
  let retrying = false;
  let timer;

  const retry = (retryFunc: () => void) => {
    if (!retrying) {
      retrying = true;
      timer = setTimeout(
        () => {
          retrying = false;
          timer = null;
          retryFunc();
        },
        retryInterval,
      );
    }
  };

  retry.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      retrying = false;
      timer = null;
    }
  };

  return retry;
};
