/* @flow */
import appRootDir from 'app-root-dir';

import createJSS2CSSCompiler, {
  type JSS2CSSCompiler,
} from './createJSS2CSSCompiler';

export default ({
  onlyValidate,
  outputDir,
  jss2cssPaths,
}: {|
  onlyValidate?: boolean,
  outputDir: string,
  jss2cssPaths: Array<string>,
|}): JSS2CSSCompiler => {
  const srcDir = appRootDir.get();

  return createJSS2CSSCompiler(
    srcDir,
    outputDir,
    jss2cssPaths,
    onlyValidate,
  );
};
