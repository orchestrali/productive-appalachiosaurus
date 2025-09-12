const getperms = require("./permutation.js");
const leadheads = require("./leadheads.js");
const fs = require('fs');

module.exports = function courseorders(stage) {
  let permutations = getperms(stage);
  let groups = [];
  let p = 0;
  do {
    let group = [];
    let pborder = permutations[p];
    group.push(pborder);
    let rev = pborder.slice(1);
    rev.reverse();
    rev.unshift(stage);
    group.push(rev);
    for (let i = 2; i < stage/2; i++) {
      let order = [];
      let ord = [];
      let j = 0;
      for (let n = stage; n > 1; n--) {
        order.push(pborder[j]);
        ord.push(rev[j]);
        j += i;
        if (j >= pborder.length) j -= pborder.length;
      }
      group.push(order, ord);
    }
    groups.push(group);
    
    p++;
    while (p < permutations.length && groups.find(g => g.some(a => a.every((n,i) => n === permutations[p][i])))) {
      p++;
    }
  } while (p < permutations.length);
  
  let arr = leadheads(groups, stage);
  
  fs.writeFileSync("src/courseorder/major.json", JSON.stringify(arr, null, 2).replace(/\n      +/g, "").replace(/\n    \]/g, "]"));
  //console.log(groups[0]);
  
}