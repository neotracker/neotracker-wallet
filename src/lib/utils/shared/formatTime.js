/* @flow */
import timeago from 'timeago.js'

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

export default (time: number) => {
  let value;
  const timeMS = time * 1000;
  if ((Date.now() - timeMS) > TWO_DAYS_MS) {
    value = (new Date(timeMS)).toLocaleString();
  } else {
    value = timeago().format(timeMS);
  }
  return value;
}
