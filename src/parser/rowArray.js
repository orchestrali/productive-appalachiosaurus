const places = require('../places.js');

// if leads <= 1 this generates one lead of a method, otherwise it generates a plain course
module.exports = function rowArray(method, leads) {
  let arrayRows = [];
  
  let prevRow = [];
  
  for (var i = 0; i < method.stage; i++) {
    prevRow.push(i+1);
  }
  
  let roundsStr = prevRow.map(e => places[e-1]).join('');
  let lastrow;
  
  do {
    for (var j = 0; j < method.pnFull.length; j++) {
      let row = [];
      let direction = 1;

      for (var p = 1; p <= method.stage; p++) {
        if (method.pnFull[j].indexOf(p) > -1) {
          row.push(prevRow[p-1]);
        } else {
          row.push(prevRow[p-1+direction]);
          direction *= -1;
        }
      }
      prevRow = row;
      arrayRows.push(row);

    }
    lastrow = arrayRows[arrayRows.length-1].map(e => places[e-1]).join('');
    
  } while (leads > 1 && lastrow != roundsStr)
  
  return arrayRows;
}