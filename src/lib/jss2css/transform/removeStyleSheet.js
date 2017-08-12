const t = require('babel-types');

const {
  isJSSThemeReactorImport,
  isJSSThemeReactorRequire,
} = require('./utils');

module.exports = () => ({
  visitor: {
    Program: {
      exit(path) {
        const bodyPaths = path.get('body');
        bodyPaths.forEach(bodyPath => {
          if (
            t.isImportDeclaration(bodyPath.node) &&
            bodyPath.node.specifiers.length === 1 &&
            isJSSThemeReactorImport(bodyPath.get('specifiers')[0])
          ) {
            bodyPath.remove();
          } else if (
            t.isVariableDeclaration(bodyPath.node) &&
            bodyPath.node.declarations.length === 1 &&
            isJSSThemeReactorRequire(bodyPath.node.declarations[0].init)
          ) {
            bodyPath.remove();
          }
        });
      },
    },
  },
});
