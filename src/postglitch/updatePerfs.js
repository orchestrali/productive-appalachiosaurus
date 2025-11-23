const findFields = require("../find/findFields.js");
const find = require("../find/find.js");

//okay really I should just be rebuilding the method database and performances with it, to catch the firsts I wasn't looking for
//probably some of the current (Nov 2025) performances are from all the duplicate methods

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
      
      let problemcount = 0;
      let filtered = [];
      perfs.forEach(p => {
        let t = idindex[p.method];
        if (t) {
          p.methodTitle = t;
          filtered.push(p);
        }
      });

      console.log("problemcount: "+(perfs.length-filtered.length));
      let stop = Math.min(200, filtered.length);
      let i = 0;

      function updateloop() {
        let p = filtered[i];
        p.save().then(); // .........
      }
    });
    
  });
  
}
