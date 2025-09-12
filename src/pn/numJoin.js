module.exports = function numJoin(tokens) {
  var arrayNumJoin = [];
  var prevToken = 'all change';
  
  for (var i = 0; i < tokens.length; ++i) {
    if (prevToken == tokens[i].type && prevToken == 'number') {
      arrayNumJoin[arrayNumJoin.length - 1].value += tokens[i].value;
    } else if (tokens[i].type == 'separator') {
      prevToken = 'separator';
    } else {
      arrayNumJoin.push(tokens[i]);
      prevToken = tokens[i].type;
    } 
  }
  
  return arrayNumJoin;
}