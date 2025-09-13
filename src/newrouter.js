const updateFiles = require('./updatefiles.js');
const parseMethods = require('./parseMethods.js');
const addRecords = require('./mongoose/addRecords.js');
const fs = require('fs');


module.exports = function router(download, filter, cb) {
  //build updated methodlist.json first? can no longer do it at the end and have it persist
  if (download) {
    console.log("updating files");
    updateFiles(next);
  } else {
    next();
  }

  //with the appropriate collection, create the method objects to be added to the database
  function next() {
    console.log("parsing methods");
    let things = ["method", "performance", "title"];
    let i = 0;

    
    parseMethods(filter, (res) => {
      console.log(res.methods.length + " methods");
      cb(res);
    });

    function addStuff(res) {
      let c = things[i];
      addRecords(res[c+"s"], c, () => {
        console.log("finished adding "+c+"s");
        i++;
        if (i < things.length) {
          addStuff(res);
        } else {
          console.log("finished???");
          cb(res.notes);
        }
      });
    }
  }
}


