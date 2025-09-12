const filterColl = require('./filterCollection.js');
const fs = require('fs');
const stream = require('stream');
const parse = require('./parser/router.js');
const addIDs = require('./addIDs.js');
const connect = require('./mongoose/connect.js');
const find = require('./find/find.js');

module.exports = function parseMethods(filter, cb) {
  //if filter, create the filtered collection
  
  if (fs.existsSync('work/collection.json')) {
    if (filter) {
      filterColl(next);
    } else {
      next('work/collection.json');
    }
    
  }
  //use the appropriate json file to parse methods
  function next(path) {
    let collection = JSON.parse(fs.readFileSync(path));
    if (!filter) collection = collection.collection.methodSet;
    
    let methods = [];
    let notes = [];
    let titles = [];
    let performances = [];
    for (let i = 0; i < collection.length; i++) {
      console.log("methodSet "+(i+1));
      let res = parse(collection[i]);
      methods.push(...res.methods);
      notes.push(...res.notes);
    }
    console.log("methods: "+methods.length);
    let s = new stream.Readable();
    let str = JSON.stringify(methods, null, 2).replace(/\n      +/g, "").replace(/\n    \]/g, "]");
    s.push(str);
    s.push(null);
    s.pipe(fs.createWriteStream('work/methods.json')).on("finish", () => {
      console.log("methods written to work directory");
      //cb();
    });
    if (!filter) {
      connect();
      find("title", {type: "method"}, (titles) => {
        separate(titles);
      });
    } else {
      separate([]);
    }
    
    //handle id matching/generation?
    
    function separate(t) {
      console.log("separate function");
      for (let i = 0; i < methods.length; i++) {
        if (i%100 === 1) console.log(i);
        let res = addIDs(methods[i], t);
        if (res.title) titles.push(res.title);
        performances.push(...res.performances);
      }
      cb({methods: methods, performances: performances, titles: titles, notes: notes});
    }
  }
  
  
  
}