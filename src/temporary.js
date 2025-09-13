//old methods with modified titles
//build new method collection

//{ _id: ObjectId('5d2d5ccaed71425508c814de') }

const connectDrop = require('./mongoose/connectDrop.js');
const connect = require('./mongoose/connect.js');
const find = require('./find/find.js');
const addRecords = require('./mongoose/addRecords.js');
const addIDs = require('./addIDs.js');
const fs = require('fs');
const stream = require('stream');

var things = ["methods2","performances","titles"];

module.exports = function update() {
  //entirely rebuilding collections
  connectDrop(["methods", "performances"], (db) => {
    find("title", {type: "method"}, (titles) => {
      //methods json file created separately
      let methods = JSON.parse(fs.readFileSync('work/methods.json'));
      console.log("methods: "+ methods.length);
      let i = 0;
      let performances = [];
      let tt = [];
      let mm = [];
      
      cycle();
      
      function cycle() {
        do {
          //remove methods from source array as they are added to the new one
          let res = addIDs(methods[0], titles);
          mm.push(methods.shift());
          if (res.title) {
            tt.push(res.title);
          }
          if (res.newtitle) tt.push(res.newtitle);
          performances.push(...res.performances);
          i++;
          //100 methods at a time
        } while (methods.length && i%100 > 0);
        console.log(i);
        addRecords(mm, "method", () => {
          addRecords(performances, "performance", () => {
            mm = [];
            performances = [];
            if (methods.length) {
              cycle();
            } else {
              console.log("titles: "+tt.length);
              let s = new stream.Readable();
              let str = JSON.stringify(tt, null, 2);
              s.push(str);
              s.push(null);
              s.pipe(fs.createWriteStream('src/titles.json')).on("finish", () => {
                console.log("titles written");
              });
            }
          });
        });
        
      }
    });
  });
  
  
};
