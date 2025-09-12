const times = require('./times.js').split(' ');
const updateFiles = require('./updatefiles.js');
const parseMethods = require('./parseMethods.js');
const connectDrop = require('./mongoose/connectDrop.js');
const connect = require('./mongoose/connect.js');
const addRecords = require('./mongoose/addRecords.js');
const fs = require('fs');
const stream = require('stream');

module.exports = function router(query, time, filter, cb) {
  console.log(time);
  let diff = time - times[times.length-1];
  times.push(time);
  if (times.length > 200) {times.splice(0, times.length-200)}
  
  //update the files from CCCBR
  if (query.download == 'true' && diff > 120000) {
    console.log("updating files");
    updateFiles(next);
  } else if (diff <= 120000) {
    console.log("request is too soon");
    
  } else if (!query.download) {
    next();
  }
  
  //with the appropriate collection, create the method objects to be added to the database
  function next() {
    console.log("parsing methods");
    
    parseMethods(filter, (res) => {
      let i = 0;
      let things = ["method", "performance", "title"];
      console.log(filter);
      if (!filter) {
        let s = new stream.Readable();
        let str = JSON.stringify(res, null, 2).replace(/\n      +/g, "").replace(/\n    \]/g, "]");
        s.push(str);
        s.push(null);
        s.pipe(fs.createWriteStream('work/results.json')).on('finish', () => {
          //connect();
        //addStuff();
          console.log("finished");
        });
        //connectDrop(["methods", "performances"], () => {
        //  addStuff();
        //});
      } else {
        connect();
        addStuff();
      }
      
      
      function addStuff() {
        let c = things[i];
        addRecords(res[c+"s"], c, () => {
          console.log("finished adding "+c+"s");
          i++;
          if (i < things.length) {
            addStuff();
          } else {
            fs.writeFileSync('src/times.js', 'module.exports = "' + times.join(' ') + '"');
            let notes = JSON.parse(fs.readFileSync('src/notes.json')).concat(res.notes);
            fs.writeFileSync('src/notes.json', JSON.stringify(notes, null, 2));
            console.log("finished???");
            cb();
          }
        });
      }
      
    });
    
  }
  
  
  //if just adding new methods:
  //separate methods and performances and generate ids for both
  //add to methods and performances databases, also add titles/ids to titles database?
  
  //if updating the entire collection:
  //retrieve titles, separate methods and performances and attach/generate ids as appropriate
  //drop collections, add methods and performances, add additional titles generated
  
  //put these in another file? adding calls, adding methods above and below, updating the local file, updating the apps
  
}