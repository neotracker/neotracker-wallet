/* @flow */
import { MUI_SHEET_ORDER } from 'material-ui/styles/muiThemeProviderFactory';

import _ from 'lodash';
import appRootDir from 'app-root-dir';
import * as babylon from 'babylon';
import { createStyleSheet } from 'jss-theme-reactor';
import crypto from 'crypto';
import { dark, light } from 'material-ui/styles/palette';
import fs from 'fs';
import generate from 'babel-generator';
import green from 'material-ui/colors/green';
import orange from 'material-ui/colors/orange';
import red from 'material-ui/colors/red';
import yellow from 'material-ui/colors/yellow';
import nodePath from 'path';
// $FlowFixMe
import { promisify } from 'util';
import * as t from 'babel-types';
import { transform } from 'babel-core';
import traverse from 'babel-traverse';
import vm from 'vm';

import { isCreateStylesheet } from '~/src/lib/jss2css/transform/utils';
import { entries, values } from '~/src/lib/utils/objects';

import createGenStyleManager from '~/src/lib/jss2css/createGenStyleManager';
import { createContext } from '~/src/shared/styles/createStyleManager';
import {
  formatCSSText,
  formatJSText,
  hash,
  writeFile,
} from '../codegen/writer';
import { logError } from '../utils';

import type CodegenDirectory from '../codegen/CodegenDirectory';
import { type Compiler } from '../codegen/compile';

const readFile = promisify(fs.readFile);
const title = 'jss2css';
const useStrict = /['"]use strict['"];?(\r?\n)*/g;
const BABYLON_OPTIONS = {
  allowImportExportEverywhere: true,
  allowReturnOutsideFunction: true,
  allowSuperOutsideMethod: true,
  sourceType: 'module',
  plugins: [
    // Previously "*"
    'asyncGenerators',
    'classProperties',
    'decorators',
    'doExpressions',
    'dynamicImport',
    'exportExtensions',
    'flow',
    'functionBind',
    'functionSent',
    'jsx',
    'objectRestSpread',
  ],
  strictMode: false,
};
const CUSTOM_SHEET_ORDER = [
  'Chevron',
  'Icon',
  'IconLink',
  'Link',
  // TODO: Specific to this project
  'TransactionSummaryBody',
  'TransactionView',
  'Column',
  'BlockTable',
];
const SHEET_ORDER = {};
MUI_SHEET_ORDER.concat(CUSTOM_SHEET_ORDER).forEach((name, idx) => {
  SHEET_ORDER[name] = idx;
});

type Sheet = {|
  name: string,
  classes: Object,
  css: string,
  index: ?number,
|};
type Sheets = { [sheetName: string]: Sheet };
type ParseResult = {
  fileToSheets: { [file: string]: Sheets },
  allSheets: Sheets,
  changedSheets: Sheets,
};

export type JSS2CSSCompiler = Compiler<ParseResult>;

const parseFileChanges = async (
  changed: Array<string>,
  deleted: Array<string>,
  prevResultIn: ?ParseResult,
): Promise<ParseResult> => {
  const result = await Promise.all(
    changed.map(file => parseFileMemoized(file).then(sheets => [file, sheets])),
  );
  const changedSheets = {};
  const allSheets = {};
  const fileToSheets = {};
  const prevResult = prevResultIn || { fileToSheets: {} };
  result.forEach(([file, sheets]) => {
    values(sheets).forEach(sheet => {
      addSheet(changedSheets, sheet);
      addSheet(allSheets, sheet);
    });

    fileToSheets[file] = sheets;
  });

  const deletedSet = new Set(deleted);
  for (const [file, sheets] of entries(prevResult.fileToSheets)) {
    if (fileToSheets[file] == null && !deletedSet.has(file)) {
      values(sheets).forEach(sheet => {
        addSheet(allSheets, sheet);
      });
      fileToSheets[file] = sheets;
    }
  }

  return {
    fileToSheets,
    allSheets,
    changedSheets,
  };
};

const cache = ({}: { [hash: string]: Sheets });
const parseFileMemoized = async (file: string): Promise<Sheets> => {
  const text = await readFile(file, 'utf-8');
  if (!text.includes('createStyleSheet')) {
    return {};
  }

  const fileHash = crypto
    .createHash('md5')
    .update(file)
    .update(text)
    .digest('hex');
  let result = cache[fileHash];
  if (!result) {
    result = await parseFile(text, file);
    cache[fileHash] = result;
  }
  return result;
};

const parseFile = async (text: string, file: string): Sheets => {
  const ast = babylon.parse(
    text,
    {
      ...BABYLON_OPTIONS,
      sourceFilename: file,
    },
  );

  const sheets = {};
  traverse(ast, {
    CallExpression: {
      enter(path) {
        if (!isCreateStylesheet(path.get('callee'))) {
          return;
        }
        const { name, classes, css } = renderStyleSheet(
          path,
          createContext({
            wrapExtended: true,
            createStyleManager: createGenStyleManager,
          }).styleManager,
          text,
          file,
        );

        addSheet(sheets, {
          name,
          classes,
          css,
          index: SHEET_ORDER[name],
        });
      },
    },
  });

  return sheets;
};

const addSheet = (sheets: Sheets, sheet: Sheet): void => {
  if (sheets[sheet.name] != null) {
    throw new Error(`Found duplicate sheet ${sheet.name}`);
  }

  // eslint-disable-next-line
  sheets[sheet.name] = sheet;
};

const write = async (
  outputDirPath: string,
  parseResult: ParseResult,
  addCodegenDir: (dirPath: string) => CodegenDirectory,
): Promise<void> => {
  const { allSheets, changedSheets } = parseResult;
  const outputDir = addCodegenDir(outputDirPath);

  await Promise.all([
    writeCSS(outputDir, allSheets),
    Promise.all(values(changedSheets).map(
      sheet => writeSheet(outputDir, sheet),
    )),
  ]);

  for (const sheet of values(allSheets)) {
    if (changedSheets[sheet.name] == null) {
      outputDir.markUnchanged(getJSFileName(sheet));
    }
  }

  await outputDir.deleteExtraFiles();
};

const writeCSS = async (
  codegenDir: CodegenDirectory,
  sheets: Sheets,
) => {
  const sorted = values(sheets).sort((a, b) => {
    if (a.index == null && b.index == null) {
      return 0;
    } else if (a.index == null) {
      return 1;
    } else if (b.index == null) {
      return -1;
    }

    if (a.index < b.index) {
      return -1;
    } else if (a.index > b.index) {
      return 1;
    } else if (a.name < b.name) {
      return -1;
    } else if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
  const css = sorted.map(sheet => sheet.css).join('\n');
  await writeFile(
    codegenDir,
    'main.css',
    css,
    hash(css),
    formatCSSText,
  );
};

const getJSFileName = (sheet: Sheet) => `${sheet.name}.js`;

const writeSheet = async (
  codegenDir: CodegenDirectory,
  sheet: Sheet,
) => {
  const js = generate(buildJS(sheet)).code;
  await writeFile(
    codegenDir,
    getJSFileName(sheet),
    js,
    hash(js),
    formatJSText,
  );
};

const buildJS = (sheet: Sheet) => {
  const obj = buildObjectExpression(sheet.classes);
  const exportObj = t.exportDefaultDeclaration(obj);
  return t.program([exportObj]);
};

const buildObjectExpression = obj => t.objectExpression(
  Object.keys(obj).map(key => t.objectProperty(
    t.stringLiteral(key),
    t.stringLiteral(obj[key]),
  )),
);

const renderStyleSheet = (
  path: any,
  styleManager: Object,
  text: string,
  filePath: string,
): Sheet => {
  const name = generate(path.node.arguments[0]).code;
  const sheet = text.substring(
    path.node.arguments[1].start,
    path.node.arguments[1].end,
  );
  const code = transform(`
    const styleSheet = createStyleSheet(${name}, ${sheet});
    const classes = styleManager.render(styleSheet);
    result = {
      name: styleSheet.name,
      classes,
      css: styleManager.sheetsToString(),
    };
  `, {
    babelrc: false,
    presets: [
      ['env', { targets: { node: true } }],
    ],
    plugins: [
      'transform-object-rest-spread',
    ],
  }).code.replace(useStrict, '');

  const sandbox = {
    result: null,
    createStyleSheet,
    styleManager,
    red,
    green,
    yellow,
    orange,
    '_': _,
    dark,
    light,
  };
  const vmContext = vm.createContext(sandbox);
  const script = new vm.Script(code, {});

  let result;
  try {
    script.runInContext(vmContext);
    result = sandbox.result;
  } catch (err) {
    if (err.name !== 'ReferenceError') {
      const message = `Encountered error while rendering stylsheet ${name}.`;
      logError({
        title,
        message,
        error: err,
      });
    }
    result = tryLoadEntireFile(
      path,
      styleManager,
      filePath,
    );

    if (result == null) {
      const message =
        `Unknown reference error while rendering stylesheet ${name}.`;
      logError({
        title,
        message,
        error: err,
      });
      throw new Error(message);
    }
  }

  if (result == null) {
    const message =
      `Encountered issue while evaluating stylesheet in path: ${filePath}.`;
    logError({
      title,
      message,
      errorMessage: message,
    });
    throw new Error(message);
  }

  return result;
};

const tryLoadEntireFile = (
  path: any,
  styleManager: Object,
  filePath: string,
): ?Sheet => {
  try {
    // $FlowFixMe
    const mod = require(nodePath.resolve(
      appRootDir.get(),
      filePath,
    ));
    const classes = styleManager.render(mod.styleSheet);
    const css = styleManager.sheetsToString();
    return {
      name: mod.styleSheet.name,
      classes,
      css,
      index: SHEET_ORDER[mod.styleSheet.name],
    }
  } catch (err) {
    // eslint-disable-next-line
    console.error(err);
  }

  return null;
}

export default (
  baseDir: string,
  outputDir: string,
  inputDirs: Array<string>,
  onlyValidate?: boolean,
): Compiler<ParseResult> => {
  const inputDirsAbsolute = inputDirs.map(inputDir => nodePath.resolve(
    appRootDir.get(),
    inputDir,
  ));
  return {
    name: 'jss2css',
    baseDir,
    watchmanExpression: [
      'allof',
      ['type', 'f'],
      ['suffix', 'js'],
      ['not', ['match', '**/__mocks__/**', 'wholename']],
      ['not', ['match', '**/__tests__/**', 'wholename']],
      ['not', ['match', '**/__generated__/**', 'wholename']],
    ],
    onlyValidate,
    parseFileChanges,
    write: (parseResult, addCodegenDir) => write(
      outputDir,
      parseResult,
      addCodegenDir,
    ),
    fileFilter: file => inputDirsAbsolute.some(
      inputDir => nodePath.resolve(
        appRootDir.get(),
        file,
      ).startsWith(inputDir),
    ),
  };
}
