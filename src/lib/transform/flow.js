const t = require("babel-types");

// eslint-disable-next-line
module.exports = () => {
  return {
    visitor: {
      ImportDeclaration: {
        enter: (path) => {
          const node = path.node;
          if (node.importKind !== 'value') {
            return;
          }

          if (!node.specifiers.every(specifier => isTypeSpecifier(specifier))) {
            return;
          }

          const declaration = t.importDeclaration(
            node.specifiers.map(specifier => t.importSpecifier(
              specifier.local,
              specifier.imported,
            )),
            node.source,
          );
          declaration.importKind = 'type';
          path.replaceWith(declaration);
        },
      },
    },
  };
};

const isTypeSpecifier = node =>
  t.isImportSpecifier(node) &&
  node.importKind === 'type';
