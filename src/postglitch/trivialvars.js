const places = "1234567890ETABCD";
const alphabet = "abcdefghijklmnopqrstuvwxyz";
const findFields = require("../find/findFields.js");
const fixedpageparts = [`<head>
  <title>Trivial Variations</title>
  <link rel="stylesheet" href="/stylehunt.css">
  <script>
  `,
                       `
  </script>
</head>
<body>
  <h2>Trivial Variations</h2>
  <p>nothing here yet</p>
  <script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
  <script src="scripttvs.js"></script>
</body>`
];

var query = {
  fields: "title class stage pn pnFull ccNum",
  query: {}
};

module.exports = function trivialvars(cb) {
  let cats = {
    none: [],
    simple: {},
    complex: {}
  };
  let alternate = {};
  let complex = {};
  let concrete;

  findFields("method", query, (res) => {
    console.log("starting processing");
    res.forEach((m,i) => {
      if (i%1000 === 0) console.log("method "+i);
      let pn = m.pnFull.map(e => e === "x" ? [] : e);
      let interactions = findinteractions(pn, m.stage);
      if (interactions.length === 0) {
        cats.none.push(m.title);
      } else {
        let ll = m.pnFull.length;
        let str = interactionstring(interactions, ll);
        let key = str.includes(";") ? "complex" : "simple";
        if (cats[key][str]) {
          cats[key][str].push(m.title);
        } else {
          cats[key][str] = [m.title];
        }
        let versions = [interactions];
        let t = m.title;
        if (str.includes(";")) {
          versions = handleoverlapsets(interactions);
          t += "*";
          complex[m.title] = versions.length;
        }
        versions.forEach(v => {
          let s = interactionstring(v, ll);
          if (alternate[s]) {
            alternate[s].push(t);
          } else {
            alternate[s] = [t];
          }
        });
        if (m.title === "Double Concrete Block Place Minor") concrete = versions.map(v => interactionstring(v,ll));
        /*
        //other grouping
        let alt = buildalternateintstr(interactions, ll);
        let exp = trivialvarexperiment(alt, pn, m.stage);
        if (alternate[exp]) {
          alternate[exp].push(m.title);
        } else {
          alternate[exp] = [m.title];
        }
        if (m.title === "Double Concrete Block Place Minor") concrete = exp;
        */
      }
    });
    let experiment = [];
    concrete.forEach(s => {
      let mm = alternate[s];
      mm.forEach(m => {
        if (!experiment.includes(m)) experiment.push(m);
      });
    });
    let page = fixedpageparts[0] + `window.trivialcats = ` + JSON.stringify(cats) + `;
    window.alternate = ` + JSON.stringify(alternate) + `;
    window.complexnums = ` + JSON.stringify(complex) + `;
    window.concretegroup = ` + JSON.stringify(experiment) + `; 
    ` + fixedpageparts[1];
    console.log("done");
    cb(page);
  });
}

/*
window.alternate = ` + JSON.stringify(alternate) + `;
    window.concretegroup = ` + JSON.stringify(alternate[concrete]) + `; 
*/




function buildintoverlaps(interactions) {
  let overlaps = [];
  for (let i = 0; i < interactions.length-1; i++) {
    let o = interactions[i];
    let filter = interactions.slice(i+1).filter(e => e.pp.some(n => o.pp.includes(n)) && e.ii.filter(n => o.ii.includes(n)).length > 1);
    filter.forEach(e => {
      overlaps.push([o.id, e.id]);
    });
  }
  return overlaps;
}

//take results of buildintoverlaps
function combineoverlaps(laps) {
  let all = [];
  let remaining = [];
  laps.forEach(a => {
    all.push(...a);
    remaining.push(a);
  });
  let sets = [];
  while (remaining.length) {
    let start = remaining.shift();
    let extraii = [];
    for (let i = 0; i < remaining.length; i++) {
      let a = remaining[i];
      if (start.some(n => a.includes(n))) {
        let add = a.filter(n => !start.includes(n));
        start.push(...add);
        extraii.push(i);
      }
    }
    extraii.reverse();
    extraii.forEach(i => remaining.splice(i,1));
    sets.push(start);
  }
  return sets;
}

//
function handleoverlapsets(interactions) {
  let laps = combineoverlaps(buildintoverlaps(interactions));
  for (let i = 0; i < interactions.length; i++) {
    let j = interactions[i].pp[0];
    interactions[i].pcode = alphabet[j];
  }
  let leftover = interactions.filter(o => !laps.some(set => set.includes(o.id)));
  
  let versions = [leftover];
  
  laps.forEach(set => {
    let arr = interactions.filter(o => set.includes(o.id));
    let options = expandoverlapset(arr);
    //options.forEach(o => console.log(o));
    let next = [];
    versions.forEach(v => {
      next.push(v.concat(...arr));
      options.forEach(o => {
        next.push(v.concat(...o));
      });
    });
    versions = next;
  });
  return versions;
}

//given interactions that overlap & have pcodes
function expandoverlapset(arr) {
  let pcodes = [];
  arr.forEach(o => {
    if (!pcodes.includes(o.pcode)) pcodes.push(o.pcode);
  });
  let groups = {
    odd: [],
    even: []
  };
  for (let i = 0; i < arr.length; i++) {
    let j = pcodes.indexOf(arr[i].pcode) % 2;
    let k = j === 0 ? "odd" : "even";
    groups[k].push(arr[i]);
  }
  let versions = [];
  ["odd", "even"].forEach(w => {
    let k = w === "odd" ? "even" : "odd";
    let keep = groups[w];
    let change = groups[k];
    let modified = [];
    change.forEach(c => {
      let pindex = alphabet.indexOf(c.pcode);
      let check = keep.filter(o => Math.abs(pindex-alphabet.indexOf(o.pcode)) === 1);
      if (!check.some(o => c.ii.every(i => o.ii.includes(i)))) {
        //if this box isn't next to another for its whole length...
        let filteredii = check.map(o => o.ii.slice(1,-1));
        let chunks = [];
        let current = [];
        for (let j = 0; j < c.ii.length; j++) {
          let i = c.ii[j];
          let test = filteredii.some(a => a.includes(i));
          if (test) {
            if (current.length > 2) {
              chunks.push(current);
            }
            current = [];
          } else {
            current.push({i: i, seg: c.segment[j]});
          }
        }
        if (current.length > 2) chunks.push(current);
        
        chunks.forEach(a => {
          let o = {
            pp: c.pp,
            ii: a.map(e => e.i),
            enterleave: a[0].seg === a[a.length-1].seg
          };
          modified.push(o);
        });
      }
    });
    versions.push(keep.concat(modified));
  });
  return versions;
}




//trying to build a representation of the invariable part
//need NEW interaction string
function trivialvarexperiment(intstr, pn, stage) {
  let intarr = intstr.split(".");
  let summary = [];
  let pnswaps = convertplacenotation(pn, stage);
  let prev = intarr[intarr.length-1];
  for (let i = 0; i < pn.length; i++) {
    let pairs = intarr[i].split("");
    let pairpp = [];
    pairs.forEach(l => {
      let nn = [1,2].map(n => alphabet.indexOf(l)+n);
      nn.forEach(n => {if (!pairpp.includes(n)) pairpp.push(n)});
    });
    let ppstr = rowstring(pairpp);
    let change = {
      places: pn[i].filter(n => !pairpp.includes(n)),
      swaps: pnswaps[i].filter(e => !ppstr.includes(e))
    };
    summary.push(change);
  }
  let combined = summary.map(o => {
    return rowstring(o.places)+":"+o.swaps.join("-");
  }).join(".");
  return combined;
}





//arr of interactions, leadlength
function interactionstring(arr, ll) {
  let timeline = [];
  for (let i = 0; i < ll; i++) {
    let current = arr.filter(o => o.ii.includes(i));
    current.sort((a,b) => a.pp[0]-b.pp[0]);
    let pp = [];
    current.forEach((o,oi) => {
      let pair = rowstring(o.pp.map(n => n+1));
      if (o.ii[o.ii.length-1] === i) {
        pair += o.enterleave ? "+" : "-";
      }
      if (pp.length) {
        let last = pp[pp.length-1];
        if (last[1] === pair[0]) { //last.length === 2 && 
          //pairs of places overlap
          let prev = current[oi-1];
          let overlapi = o.ii.filter(n => prev.ii.includes(n));
          if (overlapi.length > 1) {
            last += ";"; 
            pp.pop();
            pp.push(last);
          }
        }
      }
      pp.push(pair);
    });
    timeline.push(pp.join(""));
  }
  return timeline.join(".")
}

//changes instead of rows
function buildalternateintstr(arr, ll) {
  let timeline = [];
  for (let i = 0; i < ll; i++) {
    let current = arr.filter(o => o.ii.includes(i));
    current.sort((a,b) => a.pp[0]-b.pp[0]);
    let pp = [];
    current.forEach(o => {
      if (i != o.ii[o.ii.length-1]) {
        let pair = alphabet[o.pp[0]];
        pp.push(pair);
      }
    });
    timeline.push(pp.join(""));
  }
  return timeline.join(".");
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

////

//take place notation and convert to pairs that swap
function convertplacenotation(pn, pnstage) {
  let swaps = [];
  //at each index "i": [i+1, i+2]
  let pairs = buildnchoose2(pnstage);
  for (let i = 0; i < pn.length; i++) {
    let ch = [];
    let pp = [0].concat(pn[i]);
    pp.push(pnstage+1);
    for (let j = 0; j < pp.length-1; j++) {
      let start = pp[j];
      if (start < pairs.length) {
        let end = pp[j+1]-1;
        for (let k = start; k < end; k+=2) {
          ch.push(rowstring(pairs[k]));
        }
      }
    }
    swaps.push(ch);
  }
  return swaps;
}

//starts with [1,2] (not 0)
function buildnchoose2(n) {
  let pairs = [];
  for (let i = 1; i < n; i++) {
    pairs.push([i,i+1]);
  }
  return pairs;
}




////

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
