const places = "1234567890ETABCD";
const findFields = require("../find/findFields.js");

//searchresults.filter(o => o.pnFull.some(e => e.length > 2 && e.some((n,i) => i > 1 && n === e[i-1]+1 && n === e[i-2]+2)))

module.exports = function testfortvs(cb) {
  
  let query = {
    fields: "title class stage pn pnFull ccNum",
    query: {pn: {$regex: /\w\w\w/}}
  };

  findFields("method", query, (res) => {
    console.log("results obtained");
    res = res.filter(o => o.pnFull.some(e => e.length > 2 && e.some((n,i) => i > 1 && n === e[i-1]+1 && n === e[i-2]+2)));
    let multiclass = [];
    res.forEach(o => {
      let ll = o.pnFull.length;
      let pn = o.pnFull.map(e => e === "x" ? [] : e);
      let str = interactionstring(findinteractions(pn, o.stage), ll);
      if (str.includes(";")) multiclass.push(o);
    });
    console.log("multiclass length: "+multiclass.length);
    cb(multiclass);
  });
  
}



function interactionstring(arr, ll) {
  let timeline = [];
  for (let i = 0; i < ll; i++) {
    let current = arr.filter(o => o.ii.includes(i));
    current.sort((a,b) => a.pp[0]-b.pp[0]);
    let pp = [];
    current.forEach(o => {
      let pair = rowstring(o.pp.map(n => n+1));
      if (o.ii[o.ii.length-1] === i) {
        pair += o.enterleave ? "+" : "-";
      }
      if (pp.length) {
        let last = pp[pp.length-1];
        if (last[1] === pair[0]) { //last.length === 2 && 
          //pairs of places overlap
          last += ";"; 
          pp.pop();
          pp.push(last);
        }
      }
      pp.push(pair);
    });
    timeline.push(pp.join(""));
  }
  return timeline.join(".")
}


function findinteractions(pn, stage) {
  let pairs = [];
  let rounds = [1];
  for (let i = 1; i < stage; i++) {
    pairs.push([i-1,i]);
    rounds.push(i+1);
  }
  let ll = pn.length;
  let interactions = [];
  let half = Math.ceil(pn.length/2);
  let longpn = pn.concat(pn.slice(0,half));
  let section = buildrows(rounds, longpn);
  section.unshift(rounds);
  
  pairs.forEach(p => {
    let current = p.map(n => rounds[n]);
    let ii = [0];
    for (let i = 1; i < section.length; i++) {
      let bb = p.map(n => section[i][n]);
      let rn = i < ll ? i : i-ll;
      if (bb.every(n => current.includes(n))) {
        ii.push(i);
      } else {
        if (ii.length > 2) {
          let o = buildinteraction(section, ii, p, ll, interactions.length);
          interactions.push(o);
        }
        current = bb;
        ii = [i];
      }
    }
    //console.log(p, ii);
    if (ii.length > 2 && ii.some(n => n < ll)) {
      let o = buildinteraction(section, ii, p, ll, interactions.length);
      interactions.push(o);
    }
  });
  
  let extraii = [];
  pairs.forEach(p => {
    let filter = interactions.filter(o => p.every(n => o.pp.includes(n)));
    if (filter.length > 1) {
      for (let j = 0; j < filter.length-1; j++) {
        let o = filter[j];
        let other = filter.slice(j+1).find(e => {
          return checkcontains(e.ii, o.ii) || checkcontains(o.ii, e.ii);
        });
        if (other) {
          let i = o.ii.length < other.ii.length ? o.id : other.id;
          extraii.push(i);
        }
      }
    }
  });
  //console.log(interactions[interactions.length-1]);
  extraii.sort((a,b) => b-a);
  extraii.forEach(i => {
    interactions.splice(i,1);
  });
  
  
  return interactions;
}

function buildinteraction(section, ii, p, ll, id) {
  let segment = [];
  ii.forEach(i => {
    segment.push(p.map(n => section[i][n]));
  });
  let start = section[ii[0]][p[0]];
  let end = section[ii[ii.length-1]][p[0]];
  let o = {
    pp: p,
    ii: ii.map(n => n < ll ? n : n-ll),
    enterleave: start === end,
    id: id,
    segment: segment.map(a => rowstring(a))
  };
  return o;
}


function checkcontains(a, b) {
  return b.every(e => a.includes(e));
}

//////

//row is an array of numbers
//pn is also an array, with numbers or empty
function applypn(row, pn) {
  let next = [];
  let dir = 1;
  for (let p = 1; p <= row.length; p++) {
    if (pn.includes(p)) {
      next.push(row[p-1]);
    } else {
      next.push(row[p-1+dir]);
      dir*=-1;
    }
  }
  return next;
}

function buildrows(start, pn) {
  let rows = [];
  let prev = start;
  for (let i = 0; i < pn.length; i++) {
    let next = applypn(prev, pn[i]);
    rows.push(next);
    prev = next;
  }
  return rows;
}


//convert bell characters to numbers
function bellnum(n) {
  return places.indexOf(n)+1;
}

//convert array of bell numbers to string of characters
function rowstring(arr) {
  let r = arr.map(n => places[n-1]);
  return r.join("");
}
