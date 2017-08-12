const t = require("babel-types");

// eslint-disable-next-line
module.exports = () => {
  return {
    visitor: {
      ImportDeclaration: {
        enter: (path) => {
          const node = path.node;
          if (node.source.value === 'lodash') {
            path.replaceWith(t.importDeclaration(
              node.specifiers,
              t.stringLiteral('lodash-es'),
            ));
            return;
          }

          const module =
            getModularLodash(node.source.value) ||
            getSpecificLodash(node.source.value);
          if (
            module != null &&
            node.specifiers.length === 1 &&
            t.isImportDefaultSpecifier(node.specifiers[0])
          ) {
            path.replaceWith(t.importDeclaration(
              node.specifiers,
              t.stringLiteral(`lodash-es/${module}`),
            ));
            // eslint-disable-next-line
            return;
          }
        },
      },
      CallExpression: {
        enter: (path) => {
          const node = path.node;
          if (
            t.isIdentifier(node.callee) &&
            node.callee.name === 'require' &&
            node.arguments.length === 1 &&
            t.isStringLiteral(node.arguments[0])
          ) {
            const argumentPath = path.get('arguments')[0];
            if (node.arguments[0].value === 'lodash') {
              argumentPath.replaceWith(
                t.stringLiteral('lodash-es'),
              );
              return;
            }

            const module =
              getModularLodash(node.arguments[0].value) ||
              getSpecificLodash(node.arguments[0].value);
            if (module != null) {
              argumentPath.replaceWith(
                t.stringLiteral(`lodash-es/${module}`),
              );
              // eslint-disable-next-line
              return;
            }
          }
        },
      },
    },
  };
};

const getModularLodash = value => {
  const result = value.split('.');
  if (
    result.length === 2 &&
    result[0] === 'lodash' &&
    !result[1].startsWith('_')
  ) {
    return result[1];
  }

  return null;
}

const getSpecificLodash = value => {
  const result = value.split('/');
  if (
    result.length === 2 &&
    result[0] === 'lodash'
  ) {
    return result[1];
  }

  return null;
}
