const connect = require('./mongoose/connect.js');
const find = require('./find/findFields.js');

var query = {
  query: {stage: 4},
  fields: "title stage class ccNum pnFull oldtitle"
};

module.exports = function getmethods(cb) {
  //var db = connect();
  let fields = query.fields.split(" ");
  find("method", query, (results) => {
    console.log(results.length);
    //I could just pass the callback to find, but in case I want to do anything...
    let res = results.map(o => {
      let obj = {};
      fields.forEach(f => {
        if (f === "oldtitle") {
          if (o[f] && o[f].length) obj.oldtitle = o[f];
        } else {
          obj[f] = o[f];
        }
      });
      return obj;
    });
    cb(res);
  });
}
