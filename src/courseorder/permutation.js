

module.exports = function getpermutation(n) {
  let arr = [];
  let perm = [];
  for (let i = n; i > 1; i--) {
    perm.push(i);
  }
  recurse([n],perm.slice(1));
  
  function recurse(prefix,p) {
    if (p.length === 2) {
      arr.push(prefix.concat(p), prefix.concat([p[1], p[0]]));
    } else {
      for (let i = 0; i < p.length; i++) {
        let pre = prefix.concat([p[i]]);
        let np = p.slice(i+1).concat(p.slice(0,i));
        recurse(pre, np);
      }
    }
  }
  
  return arr;
}
