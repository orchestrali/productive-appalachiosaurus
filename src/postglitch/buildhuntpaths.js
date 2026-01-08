

var huntpaths = {
  single: {
    plain: {}
  }
};

//maybe winter-beer would be a good model
//get methods and analyze their hunt paths
module.exports = function buildhuntpaths() {

  
}



//given a path, tally how many times it includes each place
//path should be array of numbers
function tallyplaces(path) {
  let used = listplaces(path);
  
  let pp = used.map(p => {
    let o = {
      place: p,
      ii: []
    };
    return o;
  });
  
  for (let i = 0; i < path.length; i++) {
    let p = path[i];
    let o = pp.find(e => e.place === p);
    o.ii.push(i);
  }
  return pp;
}

//path should be array of numbers
function listplaces(path) {
  let used = [];
  
  for (let i = 0; i < path.length; i++) {
    let p = path[i];
    if (!used.includes(p)) used.push(p);
  }
  used.sort((a,b) => a-b);
  return used;
}
