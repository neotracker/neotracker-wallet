/* @flow */
import mkdirp from 'mkdirp';

import createCompiler from './createCompiler';
import { watch } from '../codegen/compile';

export default async ({
  outputDir,
  jss2cssPaths,
}: {|
  outputDir: string,
  jss2cssPaths: Array<string>,
|}) => {
  mkdirp.sync(outputDir);
  await watch(createCompiler({
    outputDir,
    jss2cssPaths,
  }));
};
