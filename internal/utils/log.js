/* @flow */
import gutil from 'gulp-util';


export default function log({
  title,
  level,
  message,
}: {
  title: string,
  level?: 'info' | 'warn' | 'error',
  message: string,
  notify?: boolean,
}): void {
  const msg = `==> ${title} -> ${message}`;

  switch (level || 'info') {
    case 'warn':
      gutil.log(gutil.colors.yellow(msg));
      break;
    case 'error':
      gutil.log(gutil.colors.bgRed.white(msg));
      break;
    case 'info':
    default:
      gutil.log(gutil.colors.green(msg));
      break;
  }
}
