const { create } = require('jss');
const createHash = require('murmurhash-js/murmurhash3_gc');
const jssPreset = require('jss-preset-default').default;
const jssVendorPrefixer = require('jss-vendor-prefixer').default;

const createClassName = require('./createClassName');
const { find, findIndex } = require('./utils');

const { onProcessStyle } = jssVendorPrefixer();

function generateClassName(rule, sheet) {
  return createClassName(sheet.options.name, rule.key);
}

module.exports = function createGenStyleManager(theme) {
  const jssSettings = Object.assign(
    {},
    jssPreset(),
    { createGenerateClassName: () => generateClassName },
  );
  const jss = create(jssSettings);
  let sheetMap = [];
  let sheetOrder;
  /**
   * styleManager
   */
  const styleManager = {
    get sheetMap() { return sheetMap; },
    get sheetOrder() { return sheetOrder; },
    setSheetOrder,
    jss,
    theme,
    render,
    reset,
    rerender,
    getClasses,
    updateTheme,
    prepareInline,
    sheetsToString,
  };

  updateTheme(theme, false);

  function render(styleSheet) {
    const index = getMappingIndex(styleSheet.name);

    if (index === -1) {
      return renderNew(styleSheet);
    }

    const mapping = sheetMap[index];

    if (mapping.styleSheet !== styleSheet) {
      jss.removeStyleSheet(sheetMap[index].jssStyleSheet);
      sheetMap.splice(index, 1);

      return renderNew(styleSheet);
    }

    return mapping.classes;
  }

  /**
   * Get classes for a given styleSheet object
   */
  function getClasses(styleSheet) {
    const mapping = find(sheetMap, { styleSheet });
    return mapping ? mapping.classes : null;
  }

  /**
   * @private
   */
  function renderNew(styleSheet) {
    const { name, createRules, options } = styleSheet;
    const sheetMeta = `${name}-${styleManager.theme.id}`;

    const rules = createRules(styleManager.theme);
    const jssOptions = Object.assign({
      name,
      meta: sheetMeta,
    }, options);

    if (
      sheetOrder &&
      !Object.prototype.hasOwnProperty.call(jssOptions, 'index')
    ) {
      const index = sheetOrder.indexOf(name);
      if (index === -1) {
        jssOptions.index = sheetOrder.length;
      } else {
        jssOptions.index = index;
      }
    }

    const jssStyleSheet = jss.createStyleSheet(rules, jssOptions);
    const { classes } = jssStyleSheet.attach();

    sheetMap.push({ name, classes, styleSheet, jssStyleSheet });

    return classes;
  }

  /**
   * @private
   */
  function getMappingIndex(name) {
    const index = findIndex(sheetMap, (obj) => {
      if (
        !Object.prototype.hasOwnProperty.call(obj, 'name') ||
        obj.name !== name
      ) {
        return false;
      }

      return true;
    });

    return index;
  }

  /**
   * Set DOM rendering order by sheet names.
   */
  function setSheetOrder(sheetNames) {
    sheetOrder = sheetNames;
  }

  /**
   * Replace the current theme with a new theme
   */
  function updateTheme(newTheme, shouldUpdate) {
    styleManager.theme = newTheme;
    if (!styleManager.theme.id) {
      styleManager.theme.id = createHash(JSON.stringify(styleManager.theme));
    }
    if (shouldUpdate) {
      rerender();
    }
  }

  /**
   * Reset JSS registry, remove sheets and empty the styleManager.
   */
  function reset() {
    sheetMap.forEach(({ jssStyleSheet }) => { jssStyleSheet.detach(); });
    sheetMap = [];
  }

  /**
   * Reset and update all existing stylesheets
   *
   * @memberOf module:styleManager~styleManager
   */
  function rerender() {
    const sheets = [].concat(sheetMap);
    reset();
    sheets.forEach((n) => { render(n.styleSheet); });
  }

  /**
   * Prepare inline styles using Theme Reactor
   */
  function prepareInline(
    declarationIn,
  ) {
    let declaration = declarationIn;
    if (typeof declarationIn === 'function') {
      declaration = declarationIn(theme);
    }

    const rule = {
      type: 'regular',
      style: declaration,
    };

    onProcessStyle(rule.style, rule);

    return rule.style;
  }

  /**
   * Render sheets to an HTML string
   */
  function sheetsToString() {
    return sheetMap
      .sort((a, b) => {
        if (a.jssStyleSheet.options.index < b.jssStyleSheet.options.index) {
          return -1;
        }
        if (a.jssStyleSheet.options.index > b.jssStyleSheet.options.index) {
          return 1;
        }
        return 0;
      })
      .map((sheet) => sheet.jssStyleSheet.toString())
      .join('\n');
  }

  return styleManager;
}
