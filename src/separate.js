const fs = require('fs');
const stream = require('stream');
const addIDs = require('./addIDs.js');
const connect = require('./mongoose/connect.js');
const find = require('./find/find.js');

module.exports = function separate() {
  connect();
  find("title", {type: "method"}, (t) => {
    let methods = JSON.parse(fs.readFileSync('work/methods.json'));
    console.log("methods: "+ methods.length);
    console.log("method titles: "+t.length);
    let s = new stream.Readable();
    let sp = new stream.Readable();
    let st = new stream.Readable();
    //s.push("[");
    //sp.push("[");
    //st.push("[");

    for (let i = 0; i < methods.length; i++) {
      if (i%100 === 1) console.log(i);
      let res = addIDs(methods[i], t);
      if (res.title) {
        let strt = JSON.stringify(res.title, null, 2).replace(/\n      +/g, "").replace(/\n    \]/g, "]");
        //st.push(strt);
      }
      res.performances.forEach(p => {
        let str = JSON.stringify(p, null, 2).replace(/\n      +/g, "").replace(/\n    \]/g, "]");
        //sp.push(str);
      });
      let str = JSON.stringify(methods[i], null, 2).replace(/\n      +/g, "").replace(/\n    \]/g, "]");
      //s.push(str);
    }
    
    console.log("method titles: "+t.length);
    console.log(t);
    let str = JSON.stringify(t);
    s.push(str);

    //s.push("]");
    //sp.push("]");
    //st.push("]");
    s.push(null);
    sp.push(null);
    st.push(null);

    s.pipe(fs.createWriteStream('src/titles.json')).on("finish", () => {
      //sp.pipe(fs.createWriteStream('work/performances.json')).on("finish", () => {
        //st.pipe(fs.createWriteStream('work/titles.json')).on("finish", () => {
          console.log("all streams piped");
        //});
      //});
    });
  });
  
  
}