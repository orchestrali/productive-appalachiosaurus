const findFields = require("../find/findFields.js");
const find = require("../find/find.js");
//I want to fix ampersands
//and add methodTitles to performances
module.exports = function updateperfs() {
  //connect here?

  let q = {query: {performances: {$not: {$size: 0}}}, fields: "title"};
  findFields("method", q, (res) => {
    let idindex = {};
    res.forEach(o => {
      idindex[o._id] = o.title;
    });

    //next get some performances
    let pq = {methodTitle: {$exists: false}}; //probably want more filter than that
    find("performance", pq, (perfs) => {
      console.log(perfs.length + " performances");
      let stop = Math.min(200, perfs.length);
      let i = 0;
      let problemcount = 0;
      perfs.forEach(p => {
        let t = idindex[p.method];
        t ? p.methodTitle = t : problemcount++;
      });

      console.log("problemcount: "+problemcount);

      function updateloop() {
        //wait on this... 
      }
    });
    
  });
  
}
