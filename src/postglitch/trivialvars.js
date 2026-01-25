const places = "1234567890ETABCD";
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
      }
    });
    let page = fixedpageparts[0] + `window.trivialcats = ` + JSON.stringify(cats) + fixedpageparts[1];
    cb(page);
  });
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
