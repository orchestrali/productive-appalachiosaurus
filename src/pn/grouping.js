const places = require('../places');

var validGroupTokens = [',', '+', '&,', '&,+', '+,', '+,&'];

module.exports = function grouping(tokens) {
  var groupingTokens = [];
  var groupingString = '';
  var mirrorStart;
  var mirrorEnd = 0;
  var insertIndex;
  var numToReplace;
  for (var i = 0; i < tokens.length; ++i) {
    //add the grouping tokens to the array
    if (tokens[i].type == 'grouping token') {
      groupingTokens.push({
        index: i,
        token: tokens[i].value,
      });
      groupingString += tokens[i].value;
    }
  }
  //listen.info(groupingString);
  
  if (groupingString == '') {
    return tokens;
  } else {
    var toBeReversed;
    if (groupingString == ',') {
      if (groupingTokens[0].index > 1) {
        mirrorStart = 0;
        mirrorEnd = groupingTokens[0].index - 1;
        insertIndex = groupingTokens[0].index + 1;
      } else if (groupingTokens[0].index == 1) {
        mirrorStart = 2;
        mirrorEnd = tokens.length-1;
        insertIndex = tokens.length;
      }
      
    }
    
    if (mirrorEnd == 0) {
      toBeReversed = tokens.slice(mirrorStart);
    } else {
      toBeReversed = tokens.slice(mirrorStart, mirrorEnd);
    }
    
    toBeReversed.reverse();

    for (var j = 0; j < toBeReversed.length; j++) {
      tokens.splice(insertIndex + j, 0, toBeReversed[j]);
    }
    
  }
 
  return tokens;
}