

module.exports = function lexer(obj, keys) {
  let tokens = [];
  
  for (var key in obj) {
    if (keys.indexOf(key) > -1) {
      let token = {
        name: key,
        value: obj[key]
      }
      tokens.push(token)
    } else {
      //detailLog.info('discarded key: '+key);
    }
  }
  
  return tokens;
}