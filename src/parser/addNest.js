module.exports = function addNest(parent) {
  let value = {};
  for (var key in parent) {
    value[key] = parent[key];
  }
  return value;
}