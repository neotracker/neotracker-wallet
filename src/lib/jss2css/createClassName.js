module.exports = function createClassName(name, rule) {
  if (name == null) {
    // eslint-disable-next-line
    console.error(`Found null name for rule: ${rule}`)
  }
  if (rule == null) {
    // eslint-disable-next-line
    console.error(`Found null rule for name: ${name}`)
  }
  return `${name}-${rule}`;
}
