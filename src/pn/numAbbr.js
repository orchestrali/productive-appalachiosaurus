const places = require('../places');

module.exports = function parseNumAbbr(tokens, numBells) {
  //do stuff with the objects of type 'number'
  for (var i = 0; i < tokens.length; ++i) {
    if (tokens[i].type == 'number') {
      //turn value string into array of characters
      let numArray = tokens[i].value.split('');
      
      //convert strings in array to numbers
      numArray = numArray.map(x => {
        return places.indexOf(x)+1;
      });
      
      
      //odd AND even bell methods:
        //if the value begins with an even number, add 1 to beginning
      if (numArray[0] % 2 == 0) {
        numArray.unshift(1);
      }
        //if consecutive places only have one place between, add that place
      if (numArray.length > 1) {
        for (var j = 0; j < (numArray.length - 1); ++j) {
          if (numArray[j + 1] - numArray[j] == 2) {
            numArray.splice(j+1, 0, numArray[j] + 1);
            
          }
        }
      }
      
  //even bell methods:
      //if the value ends with an odd number, add numBells to end
      if (numBells % 2 == 0 && numArray[numArray.length - 1] % 2 == 1) {
        numArray.push(numBells);
      }
  //odd bell methods:
    //if the value ends with an even number, add numBells to end 
      if (numBells % 2 == 1 && numArray[numArray.length - 1] % 2 == 0) {
        numArray.push(numBells);
      }
      tokens[i].value = numArray;
    }
  }

  return tokens;
}