const t = require("babel-types");
// eslint-disable-next-line
const slash = require('slash');
const nodePath = require('path');

const root = slash(global.rootPath || process.cwd());

const hasRootPathPrefixInString = (importPath, rootPathPrefix = '~') => {
  let containsRootPathPrefix = false;

  if (typeof importPath === 'string') {
    if (importPath.substring(0, 1) === rootPathPrefix) {
      containsRootPathPrefix = true;
    }

    const firstTwoCharactersOfString = importPath.substring(0, 2);
    if (firstTwoCharactersOfString === `${rootPathPrefix}/`) {
      containsRootPathPrefix = true;
    }
  }

  return containsRootPathPrefix;
};

const transformRelativeToRootPath = (importPath, rootPathSuffix, rootPathPrefix, sourceFile = '') => {
  let withoutRootPathPrefix = '';
  if (hasRootPathPrefixInString(importPath, rootPathPrefix)) {
    if (importPath.substring(0, 1) === '/') {
      withoutRootPathPrefix = importPath.substring(1, importPath.length);
    } else {
      withoutRootPathPrefix = importPath.substring(2, importPath.length);
    }

    const absolutePath = nodePath.resolve(`${rootPathSuffix || './'}/${withoutRootPathPrefix}`);
    let sourcePath = sourceFile.substring(0, sourceFile.lastIndexOf('/'));

    // if the path is an absolute path (webpack sends '/Users/foo/bar/baz.js' here)
    if (sourcePath.indexOf('/') === 0 || sourcePath.indexOf(':/') === 1 || sourcePath.indexOf(':\\') === 1) {
      sourcePath = sourcePath.substring(root.length + 1);
    }

    sourcePath = nodePath.resolve(sourcePath);

    let relativePath = slash(nodePath.relative(sourcePath, absolutePath));

    // if file is located in the same folder
    if (relativePath.indexOf('../') !== 0) {
      relativePath = `./${relativePath}`;
    }

    // if the entry has a slash, keep it
    if (importPath[importPath.length - 1] === '/') {
      relativePath += '/';
    }

    return relativePath;
  }

  if (typeof importPath === 'string') {
    return importPath;
  }

  throw new Error('ERROR: No path passed');
};

const traverseExpression = (arg) => {
  if (t.isStringLiteral(arg)) {
    return arg;
  }

  if (t.isBinaryExpression(arg)) {
    return traverseExpression(arg.left);
  }

  return null;
};

const replacePrefix = (path, opts = [], sourceFile) => {
  const options = [].concat(opts);

  for (let i = 0; i < options.length; i += 1) {
    let rootPathSuffix = '';
    let rootPathPrefix = '';
    const option = options[i];

    if (option.rootPathSuffix && typeof option.rootPathSuffix === 'string') {
      rootPathSuffix = option.rootPathSuffix;
    }
    if (option.rootPathPrefix && typeof option.rootPathPrefix === 'string') {
      rootPathPrefix = option.rootPathPrefix;
    } else {
      rootPathPrefix = '~';
    }

    if (hasRootPathPrefixInString(path, rootPathPrefix)) {
      return transformRelativeToRootPath(path, rootPathSuffix, rootPathPrefix, sourceFile);
    }
  }

  return path;
};

// eslint-disable-next-line
module.exports = () => {
  return {
    visitor: {
      ImportDeclaration(path, state) {
        const sourcePath = path.get('source');
        const newSource = replacePrefix(
          sourcePath.node.value,
          state.opts,
          state.file.opts.filename,
        );
        if (newSource !== sourcePath.node.value) {
          sourcePath.replaceWith(t.stringLiteral(newSource));
        }
      },
    },
  };
};
