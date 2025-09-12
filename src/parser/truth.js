const rowArray = require('./rowArray.js');
const places = require('../places.js');

module.exports = function checkTruth(method) {
  let lead = rowArray(method, 1);
  
  if (next(lead)) {
    let course = rowArray(method, 2);
    method.leadtruth = true;
    method.coursetruth = next(course);
  } else {
    method.leadtruth = false;
    method.coursetruth = false;
  }
  
  
  function next(arr) {
    let arrStrings = [];
    let truth = true;
    let i = 0;
    
    while (truth && i < arr.length) {
      let current = arr[i].map(e => places[e-1]).join('');
      if (arrStrings.includes(current)) {
        truth = false;
      } else {
        arrStrings.push(current);
        i++;
      }
    }
    
    return truth;
  }
  
  
  
}