const lexer = require('./lexer.js');
const numJoin = require('./numJoin.js');
const parseNumAbbr = require('./numAbbr.js');
const grouping = require('./grouping.js');
const stringify = require('./stringify.js');

//takes input method, returns fully parsed array of place notation
module.exports = function parseNotation(method, err) {
  if (method.pn && method.stage) {
    let tokens = lexer(method.pn, method.stage);
    if (tokens.unknown.length > 0) {
      console.warn('invalid place notation');
      console.warn(method);
      err.push({notes: "invalid place notation", method: method});
    } else {
      method.pnFull = stringify(grouping(parseNumAbbr(numJoin(tokens.tokens, method.stage))));
      
    }
    //stringify(grouping(parseNumAbbr(numJoin(lexer(method.pn, numBells)), numBells)))
  } else {
    console.warn('method missing PN or stage!');
    console.warn(method);
    err.push({notes: "method missing PN or stage!", method: method});
  }
  
}