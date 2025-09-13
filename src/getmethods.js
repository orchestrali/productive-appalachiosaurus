const connect = require('./mongoose/connect.js');
const find = require('./find/findFields.js');

var query = {
  query: {stage: 4},
  fields: "title stage class ccNum pnFull oldtitle"
};

module.exports = function getmethods(cb) {
  var db = connect();
  find("method", query, (results) => {
    console.log(results.length);
    //I could just pass the callback to find, but in case I want to do anything...
    cb(results);
  });
}
