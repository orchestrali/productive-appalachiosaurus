const places = require('../places');

//actually only recognizing commas as grouping tokens
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
    let commai = groupingString.indexOf(",");
    let commaj = groupingTokens[commai].index;
    let segments = [{start: commaj+1, end: tokens.length},{start: 0, end: commaj}];
    segments.forEach(o => {
      let first = tokens[o.start];
      if (first.value != "+") {
        let start = o.start;
        if (first.value === "&") start++;
        let l = o.end-start;
        tokens[o.end-1].sympoint = true;
        if (l > 1) {
          //mirroring is actually possible
          let toBeReversed = tokens.slice(start, o.end-1);
          toBeReversed.reverse();
          tokens.splice(o.end, 0, ...toBeReversed);
        }
      }
    });
    
  }
 
  return tokens;
}
