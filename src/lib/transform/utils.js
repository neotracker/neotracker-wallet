const t = require("babel-types");

module.exports.isImportedIdentifier = (importedName, source) => path => {
  const node = path.node;
  if (t.isIdentifier(node)) {
    if (_isImport(path, importedName, source)) {
      return true;
    } else if (_isRequire(path, importedName, source)) {
      return true;
    }
  }

  return false;
};

const _isImport = (path, importedName, source) => {
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

  return (
    t.isImportSpecifier(path.node) &&
    path.node.imported.name === importedName &&
    t.isImportDeclaration(path.parent) &&
    path.parent.source.value === source
  );
};

const _isRequire = (path, importedName, source) => {
  if (!t.isReferenced(path.node, path.parent)) {
    return false;
  }

  const binding = path.scope.getBinding(path.node.name);
  if (binding == null) {
    return false;
  }

  if (!t.isVariableDeclarator(binding.path.node)) {
    return false;
  }

  const initPath = binding.path.get('init');
  const init = initPath.node;
  return (
    t.isCallExpression(init) &&
    t.isIdentifier(init.callee) &&
    init.callee.name === 'require' &&
    init.arguments.length === 1 &&
    t.isStringLiteral(init.arguments[0]) &&
    init.arguments[0].value === source
  );
}
