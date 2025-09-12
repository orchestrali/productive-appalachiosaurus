const lexer = require('./lexer.js');
const handleProps = require('./handleProps.js');
const handleMethod = require('./handleMethod.js');
const compareSet = require('./compareSet.js');
const parsePN = require('../pn/router.js');
const truth = require('./truth.js');
const addNums = require('./addNums.js');
const keys1 = ['properties', 'method'];
const keys2 = ['stage','huntbellPath', 'classification', 'lengthOfLead','numberOfHunts', 'leadHead', 'leadHeadCode', 'falseness', 'symmetry'];
const keys2m = ['title', 'id', 'name', 'notation', 'references', 'performances', 'notes'];


module.exports = function router(obj) {
  let level1 = lexer(obj, keys1); //divide methodSet into properties and method(s)
  let props;
  let propObj;
  let methods = []; //for arrays of tokens
  let methodArr = []; //for method objects
  let errors = [];
  
  
  for (let i = 0; i < level1.length; i++) {
    if (level1[i].name == keys1[0]) {
      //turn properties tokens into an object with the methodSet properties
      props = lexer(level1[i].value, keys2);
      propObj = handleProps(props, errors);
    } else if (level1[i].name == keys1[1]) {
      //turn methods into arrays of tokens
      if (Array.isArray(level1[i].value)) {
        for (var j = 0; j < level1[i].value.length; j++) {
          methods.push(lexer(level1[i].value[j], keys2.concat(keys2m)));
        }
      } else {
        methods.push(lexer(level1[i].value, keys2.concat(keys2m)));
      }
      //listen.info('method tokens', methods);
    }
  }
  //turn arrays of tokens into method objects
  for (let j = 0; j < methods.length; j++) {
    let mObj = handleMethod(handleProps(methods[j], errors), methods[j], errors);
    methodArr.push(mObj);
  }
  
  for (let i = 0; i < methodArr.length; i++) {
    compareSet(propObj, methodArr[i], errors);
    parsePN(methodArr[i], errors);
    if (methodArr[i].pnFull) {
      addNums(methodArr[i], errors);
    }
  }
  
  return {methods: methodArr, notes: errors};
}