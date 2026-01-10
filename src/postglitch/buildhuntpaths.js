const places = "1234567890ETABCD";
const findFields = require("../find/findFields.js");
const pagestart = [`<head>
  <title>Hunt bell paths</title>
  <link rel="stylesheet" href="/stylehunt.css">
  <script>
  `,
                   `
  </script>
</head>
<body>
<div id="tablecolumn">
  <h2>Single hunt methods</h2>
  <div class="table">
    <h3>Plain hunt paths</h3>
    <table id="singleplain">
      <thead>
        <tr>
          <th rowspan="2">hunt on</th>
          <th rowspan="2">lowest place</th>
          <th rowspan="2">bell/start</th>
          <th rowspan="2">right/wrong</th>
          <th colspan="14">number of methods by stage</th>
        </tr>
        <tr>
          <th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th><th>13</th><th>14</th><th>15</th><th>16</th>
          <th>total</th>
        </tr>
      </thead>
      <tbody>
`,
                  `
      </tbody>
    </table>
  </div>
  <div class="table">
    <h3>Treble dodging paths</h3>
    <table id="singledodging">
      <thead>
        <tr>
          <th rowspan="2">hunt on</th>
          <th rowspan="2">lowest place</th>
          <th rowspan="2">bell/start</th>
          <th rowspan="2">num dodges</th>
          `];
const pageend = `
      </tbody>
    </table>
  </div>
</div>
<div id="border"></div>
<div id="methodcolumn">
  <div id="methodcontainer">
    <h4>Methods</h4>
    <ul></ul>
  </div>
</div>
<script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
<script src="scripthunt.js"></script>
</body>
`;
var huntclasses = ['Bob', 'Place', 'Treble Bob', 'Treble Place', 'Delight', 'Surprise', 'Alliance', 'Hybrid'];
var huntpaths = {
  single: {
    plain: {},
    dodging: {},
    alliance: {}
  },
  alliancecounts: {
    common: 0,
    weird: 0
  },
  multi: {}
};
var dodgingstages = [];
var queryfields = "title stage huntPath ccNum"; // huntBells pnFull
var cycles = [
  {query: {"classification.plain": true}, analyze: analyzesingleplain, key: "plain"},
  {query: {"classification.trebleDodging": true}, analyze: analyzesingledodging, key: "dodging"},
  {query: {class: "Alliance"}, analyze: groupalliance}
];
var pageelems = [];

//maybe winter-beer would be a good model
//get methods and analyze their hunt paths
module.exports = function buildhuntpaths(cb) {

  multihunts();

  function singleloop(i) {
    let query = {
      fields: queryfields,
      query: cycles[i].query
    };
    query.query.numHunts = 1;
    query.query.stage = {$gt: 3, $lt: 17};
    findFields("method", query, (res) => {
      res.forEach(m => cycles[i].analyze(m));
      if (cycles[i].key) {
        let tbody = buildsinglecommontable(cycles[i].key);
        pageelems.push(tbody);
      }
      i++;
      cycles[i] ? singleloop(i) : assemblepage();
    });
  }

  function multihunts() {
    let query = {
      fields: queryfields + " class huntBells pnFull",
      query: {numHunts: {$gt: 1}}
    };
    findFields("method", query, (res) => {
      huntclasses.forEach(hc => {
        let filter = res.filter(m => m.class === hc);
        huntpaths.multi[hc] = filter.length;
      });
      singleloop(0);
    });
  }

  function assemblepage() {
    let str = `window.huntpaths = `+ JSON.stringify(huntpaths);
    let page = pagestart[0] + str + pagestart[1] + pageelems[0] + pagestart[2];
    let count = dodgingstages.length+1;
    page += `<th colspan="${count}">number of methods by stage</th>
        </tr>
        <tr>
          <th>${dodgingstages.join(`</th><th>`)}</th>
          <th>total</th>
        </tr>
      </thead>
      <tbody>
        `;
    page += pageelems[1] + pageend;
    cb(page);
  }
  
}







//preliminary info
function groupalliance(m) {
  let path = m.huntPath;
  let tally = tallyplaces(path);
  let tallytally = [];
  tally.forEach(o => {
    let num = o.ii.length;
    let t = tallytally.find(e => e.num === num);
    if (t) {
      t.count++;
    } else {
      tallytally.push({num: num, count: 1});
    }
  });
  let key = tallytally.length === 2 ? "common" : "weird";
  huntpaths.alliancecounts[key]++;
  let normal = normalizeplaces(path);
  let nstr = rowstring(normal);
  
  if (huntpaths.single.alliance[nstr]) {
    huntpaths.single.alliance[nstr]++;
  } else {
    huntpaths.single.alliance[nstr] = 1;
  }
}

//plain or dodging
function buildsinglecommontable(singlekey) {
  dodgingstages.sort((a,b) => a-b);
  let paths = Object.keys(huntpaths.single[singlekey]);
  paths.sort((a,b) => {
    let aa = a.split("-");
    let bb = b.split("-");
    let dd = [];
    let limit = singlekey === "plain" ? 3 : 4;
    for (let i = 0; i < limit; i++) {
      dd.push(Number(aa[i])-Number(bb[i]));
    }
    let d = dd.find(n => n != 0);
    
    return d || 0;
  });

  let trr = ``;

  paths.forEach(p => {
    let mm = huntpaths.single[singlekey][p].methods;
    mm.sort(methodsort);

    let arr = p.split("-");
    let max = Number(arr[1])+Number(arr[0])-1;
    let tr = `<tr><td>${arr.join(`</td><td>`)}`;
    if (singlekey === "plain") {
      tr += p.endsWith("r") ? `ight` : `rong`;
    }
    tr += `</td>`;
    
    let stages = singlekey === "plain" ? [4,5,6,7,8,9,10,11,12,13,14,15,16] : dodgingstages
    stages.forEach(s => {
      if (max > s) {
        tr += `<td class="notapplicable"></td>`;
      } else {
        let n = mm.filter(m => m.stage === s).length;
        let c = "";
        let id = "";
        if (n > 0) {
          id = ` id="single-${singlekey}-${p+"-"+s}"`;
          c = ` class="clickable"`;
        }
        tr += `<td${id}${c}>${n}</td>`;
      }
    });
    
    tr += `<td>${mm.length}</td></tr>
    `;
    trr += tr;
  });
  return trr;
}

function buildsingleplaintable() {
  let paths = Object.keys(huntpaths.single.plain);
  paths.sort((a,b) => {
    let aa = a.split("-");
    let bb = b.split("-");
    let dd = [];
    for (let i = 0; i < 3; i++) {
      dd.push(Number(aa[i])-Number(bb[i]));
    }
    let d = dd.find(n => n != 0);
    
    return d || 0;
  });
  
  let trr = ``;
  
  paths.forEach(p => {
    let mm = huntpaths.single.plain[p].methods;
    
    mm.sort(methodsort);
    let arr = p.split("-");
    let max = Number(arr[1])+Number(arr[0])-1;
    let tr = `<tr><td>${arr.join(`</td><td>`)}`;
    tr += p.endsWith("r") ? `ight` : `rong`;
    tr += `</td>`;
    for (let s = 4; s <= 16; s++) {
      if (max > s) {
        tr += `<td class="notapplicable"></td>`;
      } else {
        let n = mm.filter(m => m.stage === s).length;
        let c = "";
        let id = "";
        if (n > 0) {
          id = ` id="single-plain-${p+"-"+s}"`;
          c = ` class="clickable"`;
        }
        tr += `<td${id}${c}>${n}</td>`;
      }
    }
    //making totals clickable is different...
    tr += `<td>${mm.length}</td></tr>
    `;
    trr += tr;
  });
  return trr;
}

function methodsort(a,b) {
  let sd = a.stage-b.stage;
  if (sd != 0) return sd;
  return a.title.localeCompare(b.title);
}

function analyzesingledodging(m) {
  let path = m.huntPath;
  let arr = [];
  let tally = tallyplaces(path);
  arr.push(tally.length); //hunt on n places
  arr.push(tally[0].place); //lowest place
  arr.push(path[0]); //start place / hunt bell
  let num = (tally[0].ii.length-2)/2; //number of dodges in each place+direction
  arr.push(num);
  let key = arr.join("-");
  let o = huntpaths.single.dodging[key];
  let nm = {title: m.title, stage: m.stage, ccnum: m.ccNum};
  if (!dodgingstages.includes(m.stage)) dodgingstages.push(m.stage);
  if (o) {
    o.methods.push(nm);
  } else {
    huntpaths.single.dodging[key] = {methods: [nm]};
  }
}

//plain methods with one hunt bell
function analyzesingleplain(m) {
  let path = m.huntPath;
  let arr = [];
  let used = listplaces(path);
  arr.push(used.length); // hunt on n places
  arr.push(used[0]); //lowest place
  arr.push(path[0]); //start place / hunt bell
  arr.push(checkrightwrong(path));
  let key = arr.join("-");
  let o = huntpaths.single.plain[key];
  let nm = {title: m.title, stage: m.stage, ccnum: m.ccNum};
  if (o) {
    o.methods.push(nm);
  } else {
    huntpaths.single.plain[key] = {
      methods: [nm]
    };
  }
  
}

//for plain hunt paths - is the lower place made right or wrong
function checkrightwrong(path) {
  let pp = tallyplaces(path);
  let lowest = pp[0];
  let ii = lowest.ii;
  let i = (ii.includes(path.length-1) && ii.includes(0)) ? path.length-1 : Math.min(...lowest.ii);
  return i%2 === 1 ? "r" : "w";
}



//transpose to include first place
function normalizeplaces(path) {
  if (path.includes(1)) return path;
  let used = listplaces(path);
  let min = used[0];
  let diff = 1-min;
  let tp = path.map(n => n+diff);
  return tp;
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


//convert bell characters to numbers
function bellnum(n) {
  return places.indexOf(n)+1;
}

//convert array of bell numbers to string of characters
function rowstring(arr) {
  let r = arr.map(n => places[n-1]);
  return r.join("");
}



