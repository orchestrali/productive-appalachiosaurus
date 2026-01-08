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
<h2>Single hunt methods</h2>
<div>
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
`];
const pageend = `
    </tbody>
  </table>
</div>
<div id="methodcontainer">
  <ul></ul>
  <button id="closecontainer">Close</button>
</div>
<script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
<script src="scripthunt.js"></script>
</body>
`;

var huntpaths = {
  single: {
    plain: {}
  }
};

//maybe winter-beer would be a good model
//get methods and analyze their hunt paths
module.exports = function buildhuntpaths(cb) {
  let query = {
    fields: "title stage huntPath ccNum",
    query: {
      "classification.plain": true,
      numHunts: 1,
      stage: {$gt: 3, $lt: 17}
    }
  };

  findFields("method", query, (res) => {
    res.forEach(m => analyzesingleplain(m.huntPath, m.title, m.stage, m.ccNum));
    let tbody = buildsingleplaintable();
    let str = `window.huntpaths = `+ JSON.stringify(huntpaths);
    let page = pagestart[0] + str + pagestart[1] + tbody + pageend;
    cb(page);
  });
  
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
    
    mm.sort((a,b) => a.stage-b.stage);
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
          id = ` id="${p+"-"+s}"`;
          c = ` class="clickable"`;
        }
        tr += `<td${id}${c}>${n}</td>`;
      }
    }
    tr += `<td>${mm.length}</td></tr>
    `;
    trr += tr;
  });
  return trr;
}

//plain methods with one hunt bell
function analyzesingleplain(path, title, stage, num) {
  let arr = [];
  let used = listplaces(path);
  arr.push(used.length); // hunt on n places
  arr.push(used[0]); //lowest place
  arr.push(path[0]); //start place / hunt bell
  arr.push(checkrightwrong(path));
  let key = arr.join("-");
  let o = huntpaths.single.plain[key];
  let m = {title: title, stage: stage, ccnum: num};
  if (o) {
    o.methods.push(m);
  } else {
    huntpaths.single.plain[key] = {
      methods: [m]
    };
  }
  
}

//for plain hunt paths - is the lower place made right or wrong
function checkrightwrong(path) {
  let pp = tallyplaces(path);
  let lowest = pp[0];
  let i = lowest.ii.includes(path.length-1) ? path.length-1 : Math.min(...lowest.ii);
  return i%2 === 1 ? "r" : "w";
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
