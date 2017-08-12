/* eslint-disable no-bitwise, no-plusplus */

module.exports.transform = function transform(
  obj,
  iteratee,
  accumulator,
) {
  Object.keys(obj).forEach((key) => {
    iteratee(accumulator, obj[key], key);
  });
  return accumulator;
}

const contains = function contains(obj, pred) {
  for (const key in pred) {
    if (
      !Object.prototype.hasOwnProperty.call(obj, key) ||
      obj[key] !== pred[key]
    ) {
      return false;
    }
  }
  return true;
};

const findIndex = function findIndex(arr, pred) {
  const predType = typeof pred;
  for (let i = 0; i < arr.length; i++) {
    if (predType === 'function' && pred(arr[i], i, arr) === true) {
      return i;
    }
    if (predType === 'object' && contains(arr[i], pred)) {
      return i;
    }
    if (['string', 'number', 'boolean'].indexOf(predType) !== -1) {
      return arr.indexOf(pred);
    }
  }
  return -1;
};

module.exports.find = function find(arr, pred) {
  const index = findIndex(arr, pred);
  return index > -1 ? arr[index] : undefined;
}

module.exports.findIndex = findIndex;
module.exports.contains = contains;
