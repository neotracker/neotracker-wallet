/* @flow */
import mkdirp from 'mkdirp';
import rimraf from 'rimraf';

import createCompiler from './createCompiler';
import { compile } from '../codegen/compile';

export default async ({
  outputDir,
  jss2cssPaths,
}: {|
  outputDir: string,
  jss2cssPaths: Array<string>,
|}) => {
  rimraf.sync(outputDir);
  mkdirp.sync(outputDir);

  await compile(createCompiler({ outputDir, jss2cssPaths }));
};
