const findFields = require("../find/findFields.js");
const find = require("../find/find.js");
const parsepn = require("../pn/router.js");


//all the methods with place notation I didn't expand properly

module.exports = function fixpn() {

  let q = {$expr: {$gt: ["$leadLength", {$size: "$pnFull"}]}};
  find("method", q, (res) => {
    console.log(res.length + " methods to fix");

    res.forEach(m => {
      parsepn(m, []);
    });
    console.log(res.filter(o => o.leadLength != o.pnFull.length).map(o => o.title));

    let i = 0;
    //updateloop();

    function updateloop() {
      let p = res[i];
      p.save().then((r) => {
        i++;
        if (i < res.length) {
          updateloop();
        } else {
          console.log("finished with this batch?");
        }
      })
      .catch((o) => {
        console.log("error in updateloop");
        console.log(i);
        console.log(p);
        console.log(typeof o);
      });
    }

    
  });
}
