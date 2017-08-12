const appRootDir = require('app-root-dir');
const nodePath = require('path');
const t = require('babel-types');

// eslint-disable-next-line
module.exports = () => {
  return {
    visitor: {
      CallExpression: {
        enter: (path) => {
          if (isCompose(path)) {
            handleCompose(path);
          } else if (isStyleManagerRender(path)) {
            handleStyleManagerRender(path);
          } else if (isWithStyles(path)) {
            handleWithStyles(path);
          }
        },
      },
    },
  };
};

const isCompose = (path) =>
  t.isIdentifier(path.node.callee) &&
  path.node.callee.name === 'compose';

const isStyleManagerRender = (path) =>
  t.isMemberExpression(path.node.callee) &&
  t.isIdentifier(path.node.callee.object) &&
  path.node.callee.object.name === 'styleManager' &&
  t.isIdentifier(path.node.callee.property) &&
  path.node.callee.property.name === 'render';

const isWithStyles = (path) =>
  t.isSequenceExpression(path.node.callee) &&
  path.node.callee.expressions.length === 2 &&
  t.isNumericLiteral(path.node.callee.expressions[0]) &&
  path.node.callee.expressions[0].value === 0 &&
  t.isMemberExpression(path.node.callee.expressions[1]) &&
  t.isIdentifier(path.node.callee.expressions[1].object) &&
  path.node.callee.expressions[1].object.name === '_withStyles2' &&
  t.isIdentifier(path.node.callee.expressions[1].property) &&
  path.node.callee.expressions[1].property.name === 'default' &&
  path.node.arguments.length === 1 &&
  t.isIdentifier(path.node.arguments[0]);

const handleCompose = (path) => {
  let modified = false;
  const args = path.get('arguments').map((argPath) => {
    const argNode = handleComposeArgument(argPath);
    if (argPath.node !== argNode) {
      modified = true;
    }

    return argNode;
  }).filter(Boolean);

  if (modified) {
    path.replaceWith(t.callExpression(
      path.node.callee,
      args,
    ));
  }
};

const handleComposeArgument = (path) => {
  // if (isGetContext(path)) {
  //   return null;
  // }
  if (isPure(path)) {
    return null;
  }

  return path.node;
};

// eslint-disable-next-line
const isGetContext = path =>
  t.isCallExpression(path.node) &&
  t.isIdentifier(path.node.callee) &&
  path.node.callee.name === 'getContext';

const isPure = path =>
  t.isIdentifier(path.node) &&
  path.node.name === 'pure';

const handleStyleManagerRender = (path) => {
  path.replaceWith(path.node.arguments[0]);
};

const withStylesPath = nodePath.resolve(
  appRootDir.get(),
  './src/lib/transform/components/withStyles',
);
const handleWithStyles = (path) => {
  path.replaceWith(t.callExpression(
    t.memberExpression(
      t.callExpression(
        t.identifier('require'),
        [t.stringLiteral(withStylesPath)],
      ),
      t.identifier('default'),
    ),
    [path.node.arguments[0]],
  ));
};
