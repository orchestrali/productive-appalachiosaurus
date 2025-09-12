const text = ['title', 'name', 'notes'];
const addNest = require('./addNest.js');
const lexer = require('./lexer.js');
const newnames = require('../newnames.js');
const handlePerform = require('./handlePerform.js');
const keysP = ['firstTowerbellPeal', 'firstHandbellPeal', 'firstTowerbellExtent', 'firstHandbellExtent', 'firstInclusionInTowerbellPeal', 'firstInclusionInHandbellPeal']
const keysP2 = ['date', 'id', 'location', 'numberOfChanges', 'society', 'conductor']

//items not in methodSet props: title, name, notation, ccNum, refs, performances, notes
module.exports = function handleMethod(method, tokens, err) {
  
  for (var i = 0; i < tokens.length; i++) {
    if (tokens[i].name === "title") {
      let names = newnames.find(o => o.newtitle == tokens[i].value);
      if (names) {
        method.oldtitle = Array.isArray(names.oldtitle) ? names.oldtitle : [names.oldtitle];
      }
    }
    
    if (text.indexOf(tokens[i].name) > -1) {
      method[tokens[i].name] = tokens[i].value.replace(/&amp;/gi, "&");
    } else if (tokens[i].name == 'notation') {
      method.pn = tokens[i].value;
    } else if (tokens[i].name == 'id') {
      method.ccNum = Number(tokens[i].value.substring(1));
    } else if (tokens[i].name == 'references') {
      method.refs = addNest(tokens[i].value);
    } if (tokens[i].name == 'performances') {
      let perfs = lexer(tokens[i].value, keysP);
      let pArr = [];
      for (var j = 0; j < perfs.length; j++) {
        let pTokens = lexer(perfs[j].value, keysP2);
        let p = {type: perfs[j].name}; 
        pArr.push(handlePerform(p, pTokens, err));
      }
      method.performances = pArr;
    }
  }
  //listen.info('method object', method);
  return method;
}