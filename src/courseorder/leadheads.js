

module.exports = function leadheads(groups, stage) {
  let zigzag = 0;
  let arr = [];
  groups.forEach(g => {
    g = g.map(pbo => {
      let lh = [1];
      for (let i = 2; i < stage; i++) {
        let j = pbo.indexOf(i);
        lh.push(pbo[j-1]);
      }
      lh.push(pbo[pbo.length-1]);
      let o = {leadhead: lh, pborder: pbo};
      let dirs = [];
      for (let i = 2; i < stage; i++) {
        dirs.push(lh[i] > lh[i-1] ? 1 : -1);
      }
      if (dirs.every((n,i) => i%2===0 ? n === dirs[0] : n === dirs[1])) {
        zigzag++;
        o.zigzag = true;
      }
      let i = pbo.findIndex(n => [2,3,4].includes(n));
      if ([2,3,4].includes(pbo[i+1]) && [2,3,4].includes(pbo[i+2])) o.courseorder = true;
      return o;
    });
    if (g.every(o => o.zigzag)) {
      //console.log(g);
    }
    arr.push(g);
  });
  
  console.log(zigzag);
  console.log(arr[4]);
  return arr;
}