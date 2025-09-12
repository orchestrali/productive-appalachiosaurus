const fs = require('fs');
const stream = require('stream');

module.exports = function doveformat() {
  let csv = fs.readFileSync("dove/towers.txt", "utf8"); //.split(/\n/);
  let keys = [];
  let towers = [];
  let current = "";
  let first = true;
  let arr = [];
  let quote = false;
  
  for (let key in csv) {
    
    switch (csv[key]) {
      case ",":
        if (first) {
          keys.push(current);
          current = "";
        } else {
          if (quote) {
            current += ",";
          } else {
            arr.push(current);
            current = "";
          }
          
        }
        
        break;
      case "\n":
        if (first) {
          keys.push(current);
          first = false;
        } else {
          arr.push(current);
          towers.push(arr);
          arr = [];
        }
        current = "";
        break;
      default:
        if (csv[key] === '"') {
          quote = !quote;
        } else if (csv[key] != "\r" && key != 0) {
          current += csv[key];
        }
    }
  }
  //console.log(keys);
  console.log(towers.length);
  ///*
  let oo = [];
  let nums = ["TowerID","RingID","Lat","Long","Bells","Wt","Hz"]
  towers.forEach(arr => {
    let o = {};
    keys.forEach((k,j) => {
      o[k] = nums.includes(k) ? Number(arr[j]) : arr[j];
    });
    if (o.App === "app") {
      o.weight = (o.Wt/112)+"cwt";
    } else {
      let wt = [Math.floor(o.Wt/112)];
      wt.push(Math.floor((o.Wt%112)/28));
      wt.push(Math.floor(o.Wt%28));
      o.weight = wt.join("–");
    }
    oo.push(o);
  });
  console.log(oo[0]);
  
  let s = new stream.Readable();
  s.push(JSON.stringify(oo,null,2));
  s.push(null);
  s.pipe(fs.createWriteStream('src/towers.json')).on('finish', () => {
    console.log("finished");
  });
  //*/
}