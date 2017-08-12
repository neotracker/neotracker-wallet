const t = require("babel-types");

module.exports.isCreateStylesheet = path => {
  const node = path.node;
  if (t.isIdentifier(node)) {
    return isCreateStylesheetImport(path);
  }

  if (
    t.isSequenceExpression(node) &&
    node.expressions.length === 2 &&
    t.isNumericLiteral(node.expressions[0]) &&
    node.expressions[0].value === 0
  ) {
    return isCreateStylesheetRequire(path.get('expressions')[1]);
  }

  return false;
};

const isCreateStylesheetImport = path => {
  if (!(
    t.isIdentifier(path.node) &&
    t.isReferenced(path.node, path.parent)
  )) {
    return false;
  }

  const binding = path.scope.getBinding(path.node.name);
  if (binding == null) {
    return false;
  }

  return isJSSThemeReactorImport(binding.path);
};

const isJSSThemeReactorImport = path =>
  t.isImportSpecifier(path.node) &&
  path.node.imported.name === 'createStyleSheet' &&
  t.isImportDeclaration(path.parent) &&
  path.parent.source.value === 'jss-theme-reactor'
module.exports.isJSSThemeReactorImport = isJSSThemeReactorImport;

const isCreateStylesheetRequire = path => {
  const node = path.node;
  if (!(
    t.isMemberExpression(node) &&
    t.isIdentifier(node.object) &&
    t.isIdentifier(node.property) &&
    node.property.name === 'createStyleSheet'
  )) {
    return false;
  }

  const jssPath = path.get('object');
  if (!t.isReferenced(jssPath.node, jssPath.parent)) {
    return false;
  }

  const binding = jssPath.scope.getBinding(jssPath.node.name);
  if (binding == null) {
    return false;
  }

  if (!t.isVariableDeclarator(binding.path.node)) {
    return false;
  }

  const initPath = binding.path.get('init');
  return isJSSThemeReactorRequire(initPath.node);
}

const isJSSThemeReactorRequire = node =>
  t.isCallExpression(node) &&
  t.isIdentifier(node.callee) &&
  node.callee.name === 'require' &&
  node.arguments.length === 1 &&
  t.isStringLiteral(node.arguments[0]) &&
  node.arguments[0].value === 'jss-theme-reactor';

module.exports.isJSSThemeReactorRequire = isJSSThemeReactorRequire;
