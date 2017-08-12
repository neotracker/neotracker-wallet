module.exports = function createClientStyleManager(theme) {
  const sheetMap = [];
  let sheetOrder;

  /**
   * styleManager
   */
  const styleManager = {
    get sheetMap() { return sheetMap; },
    get sheetOrder() { return sheetOrder; },
    setSheetOrder,
    theme,
    render,
    reset,
    rerender,
    prepareInline,
    sheetsToString,
  };

  function render(styleSheet) {
    return styleSheet;
  }

  /**
   * Set DOM rendering order by sheet names.
   */
  function setSheetOrder(sheetNames) {
    sheetOrder = sheetNames;
  }

  /**
   * Reset JSS registry, remove sheets and empty the styleManager.
   */
  function reset() {
  }

  /**
   * Reset and update all existing stylesheets
   *
   * @memberOf module:styleManager~styleManager
   */
  function rerender() {
  }

  /**
   * Prepare inline styles using Theme Reactor
   */
  function prepareInline() {
    throw new Error('Unsupported operation');
  }

  /**
   * Render sheets to an HTML string
   */
  function sheetsToString() {
    throw new Error('Should not be called');
  }

  return styleManager;
}
