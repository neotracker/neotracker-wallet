/* @flow */
import { values } from '~/src/lib/utils/objects';

import CodegenDirectory from './CodegenDirectory';
import {
  type FileFilter,
  type WatchmanExpression,
  queryFiles,
  watchChanges,
} from './watcher';

import { log, logError, profile } from '../utils';

const title = 'codegen';

export type Compiler<ParseResult> = {
  name: string,
  baseDir: string,
  watchmanExpression: WatchmanExpression,
  fileFilter?: FileFilter,
  parseFileChanges: (
    changed: Array<string>,
    deleted: Array<string>,
    prevResult?: ?ParseResult,
  ) => Promise<ParseResult>,
  write: (
    parseResult: ParseResult,
    addCodegenDir: (dirPath: string) => CodegenDirectory,
  ) => Promise<void>,
  onlyValidate?: boolean,
};

export async function compile<ParseResult>(
  compiler: Compiler<ParseResult>,
): Promise<void> {
  log({
    title: compiler.name,
    message: 'Compiling...',
  });
  try {
    const result = await parseEverything(compiler);
    await write(compiler, result);
  } catch (error) {
    logError({
      title: compiler.name,
      message: 'Encountered error while compiling.',
      error,
    });
  }
}

export async function watch<ParseResult> (
  compiler: Compiler<ParseResult>,
): Promise<void> {
  let result = null;
  await watchChanges(
    compiler.name,
    compiler.baseDir,
    compiler.watchmanExpression,
    compiler.fileFilter || anyFileFilter,
    async (changed, deleted) => {
      try {
        result = await parseFileChanges(compiler, changed, deleted, result);
        await write(compiler, result);
      } catch (error) {
        logError({
          title: compiler.name,
          message: 'Encountered error while compiling.',
          error,
        });
      }
    },
  );

  log({
    title,
    message: `Watching for changes for ${compiler.name}...`,
  });
}

async function parseEverything<ParseResult>(
  compiler: Compiler<ParseResult>,
): Promise<ParseResult> {
  const files = await queryFiles(
    compiler.baseDir,
    compiler.watchmanExpression,
    compiler.fileFilter || anyFileFilter,
  );

  return parseFileChanges(compiler, [...files], []);
};

async function parseFileChanges<ParseResult>(
  compiler: Compiler<ParseResult>,
  changed: Array<string>,
  deleted: Array<string>,
  prevResult?: ?ParseResult,
): Promise<ParseResult> {
  const parseProfiler = profile(title, 'Parsed');
  const parseResult = await compiler.parseFileChanges(
    changed,
    deleted,
    prevResult,
  );
  parseProfiler.stop();

  return parseResult;
};

async function write<ParseResult>(
  compiler: Compiler<ParseResult>,
  parseResult: ParseResult,
): Promise<Array<string>> {
  const writeProfiler = profile(title, 'Wrote');

  const onlyValidate = !!compiler.onlyValidate;
  const outputDirs = ({}: { [dirName: string]: CodegenDirectory });
  const addCodegenDir = (dirPath) => {
    if (outputDirs[dirPath] != null) {
      throw new Error(`Duplicate CodegenDirectory created for '${dirPath}'`);
    }
    const codegenDir = new CodegenDirectory(dirPath, { onlyValidate });
    outputDirs[dirPath] = codegenDir;
    return codegenDir;
  }

  await compiler.write(parseResult, addCodegenDir);

  const combineChanges = (accessor) => {
    const combined = [];
    for (const dir of values(outputDirs)) {
      combined.push(...accessor(dir.changes));
    }
    return combined;
  }
  const created = combineChanges(_ => _.created);
  const updated = combineChanges(_ => _.updated);
  const deleted = combineChanges(_ => _.deleted);
  const unchanged = combineChanges(_ => _.unchanged);

  if (onlyValidate) {
    printFiles('Missing', created);
    printFiles('Out of date', updated);
    printFiles('Extra', deleted);
  } else {
    printFiles('Created', created);
    printFiles('Updated', updated);
    printFiles('Deleted', deleted);
    log({
      title,
      message: `Unchanged files ${unchanged.length}`,
    });
  }

  writeProfiler.stop();

  return Object.keys(outputDirs);
}

const anyFileFilter = () => true;

function printFiles(label, files) {
  if (files.length > 0) {
    console.log(label + ':');
    files.forEach(file => {
      console.log(' - ' + file);
    });
  }
}
