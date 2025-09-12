var attributes = ["little", "differential", "plain", "trebleDodging"];

module.exports = function addBooleans(classification) {
  let obj = {};
  
  for (var key in classification) {
    if (attributes.indexOf(key) > -1) {
      obj[key] = true;
    }
  }

  
  for (var i = 0; i < attributes.length; i++) {
    if (!obj[attributes[i]]) {
      obj[attributes[i]] = false;
    }
  }
  return obj;
}