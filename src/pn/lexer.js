const places = require('../places');

module.exports = function lexer(placeNot, numBells) {
  var tokens = [];
  var unknown = [];
  
  for (var i = 0; i < placeNot.length; ++i) {
    var token = {};
    if (placeNot[i] == ',') {
      token.type = 'grouping token';
    } else if (placeNot[i] == '.') {
      token.type = 'separator';
    } else if (placeNot[i] == '-') {
      token.type = 'all change';
      token.value = 'x'
    } else if (numBells > places.indexOf(placeNot[i]) >= 0) {
      token.type = 'number';
    } else {
      unknown.push(token);
    }
    if (!token.value) {
      token.value = placeNot[i];
    }
    tokens.push(token);
  }
  
  return {tokens: tokens, unknown: unknown};
}