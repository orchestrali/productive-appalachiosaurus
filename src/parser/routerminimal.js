const lexer = require('./lexer.js');
const keys1 = ['properties', 'method'];
const keys2 = ["title", "id", "extensionConstruction", "performances", "notes"];
const handleMethod = require('./handleMethod.js');

//obj is a methodSet
module.exports = function routerminimal(obj) {
  let level1 = lexer(obj, keys1); //divide methodSet into properties and method(s)
  let methods = []; //for arrays of tokens
  let methodArr = []; //for method objects
  let errors = [];

  for (let i = 0; i < level1.length; i++) {
    if (level1[i].name === "method") {
      //turn methods into arrays of tokens
      if (Array.isArray(level1[i].value)) {
        for (let j = 0; j < level1[i].value.length; j++) {
          methods.push(lexer(level1[i].value[j], keys2));
        }
      } else {
        methods.push(lexer(level1[i].value, keys2));
      }
    }
  }
  //turn arrays of tokens into method objects
  for (let j = 0; j < methods.length; j++) {
    let mObj = handleMethod({}, methods[j], errors);
    methodArr.push(mObj);
  }

  return {methods: methodArr, notes: errors};
}
