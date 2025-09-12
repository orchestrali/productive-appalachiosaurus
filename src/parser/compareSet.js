

module.exports = function compareSet(set, method, err) {
  let mismatch = 0;
  for (var key in set) {
    if (!method[key]) {
      method[key] = set[key];
    } else if (method[key] != set[key]) {
      mismatch++;
    }
  }
  if (mismatch > 0) {
    console.warn("method props don't match set: " + method.title);
    err.push({notes: "method props don't match set", method: method});
  }
  
}