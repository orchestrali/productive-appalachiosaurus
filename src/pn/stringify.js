
module.exports = function(tokens) {
  var placeNotArray = [];
  
  for (var i = 0; i < tokens.length; ++i) {
   if (tokens[i].type !== 'grouping token') {
     placeNotArray.push(tokens[i].value);
   }
  }
  
  return placeNotArray;
}