const connect = require('./mongoose/connect.js');
const find = require('./find/findFields.js');
const fs = require('fs');
const stream = require('stream');

var query = {
  query: {},
  fields: "title stage class ccNum pnFull oldtitle"
}

module.exports = function buildlocal() {
  var db = connect();
  find("method", query, (results) => {
    console.log(results.length);
    //results.sort((a,b) => a.ccNum-b.ccNum);
    let s = new stream.Readable();
    let str = JSON.stringify(results, replacer, 2).replace(/\n      +/g, "").replace(/\n    \]/g, "]");
    s.push(str);
    s.push(null);
    s.pipe(fs.createWriteStream('src/methodlist.json')).on('finish', () => {
      console.log("finished");
    });
    
  });
  
}

function replacer(key, value) {
  return key === "_id" ? undefined : value;
}

