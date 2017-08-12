const appRootDir = require('app-root-dir');
const nodePath = require('path');
const t = require('babel-types');
const { isCreateStylesheet } = require('./utils');

module.exports = () => ({
  visitor: {
    Program: {
      enter(path) {
        this.context = {
          isES6: path.node.body.some(
            node => t.isImportDeclaration(node),
          ),
        };
      },
    },
    CallExpression: {
      enter(path, state) {
        if (!isCreateStylesheet(path.get('callee'))) {
          return;
        }
        if (!t.isStringLiteral(path.node.arguments[0])) {
          throw path.buildCodeFrameError(
            'Non-string literal stylesheet names are not supported.'
          );
        }

        const { isES6 } = this.context;
        const sheetName = path.node.arguments[0].value;
        const rel = nodePath.relative(
          nodePath.dirname(state.file.opts.filename),
          nodePath.resolve(
            appRootDir.get(),
            './__generated__/css',
          ),
        );
        const pathLiteral = t.stringLiteral(`${rel}/${sheetName}.js`);
        if (isES6) {
          if (!(
            t.isVariableDeclarator(path.parentPath.node) &&
            t.isVariableDeclaration(path.parentPath.parentPath.node)
          )) {
            throw path.buildCodeFrameError(
              'Expected variable declaration for createStyleSheet.'
            );
          }
          const declaratorPath = path.parentPath;
          const declarationPath = declaratorPath.parentPath;
          declarationPath.replaceWith(
            t.importDeclaration(
              [t.importDefaultSpecifier(declaratorPath.node.id)],
              pathLiteral,
            ),
          );
        } else {
          path.replaceWith(
            t.memberExpression(
              t.callExpression(
                t.identifier('require'),
                [pathLiteral],
              ),
              t.identifier('default'),
            ),
          );
        }
      },
    },
  },
});
