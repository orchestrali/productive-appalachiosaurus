const fs = require('fs');
const stream = require('stream');
var towers = require('./towers.json');

module.exports = function doveformat() {
  let csv = fs.readFileSync("dove/bells.csv", "utf8");
  let needed = ["BellID", "TowerID", "RingID", "BellRole", "Weight(lbs)", "Weight(approx)", "CastDate"];
  let needi = [];
  let keys = [];
  let bells = [];
  let current = "";
  let first = true;
  let arr = [];
  let i = 0;
  let end = false;
  let key = 1;
  let quote = false;
  
  loop();
  
  function loop() {
    
  
    do {

      switch (csv[key]) {
        case ",":
          if (first) {
            
            if (needed.includes(current)) {
              keys.push(current);
              needi.push(i);
            }
            current = "";
            i++;
          } else {
            if (quote) {
              current += ",";
            } else if (needi.includes(i)) {
              arr.push(current);
              current = "";
              i++;
            } else {
              current = "";
              i++;
            }
          }
          break;
        case "\n":
          if (first) {
            if (needed.includes(current)) {
              keys.push(current);
              needi.push(i);
            }
            first = false;
          } else {
            if (needi.includes(i)) arr.push(current);
            bells.push(arr);
            //if (bells.length === 1) console.log(arr.length);
            arr = [];
          }
          current = "";
          i = 0;
          if (bells.length === 7000) end = true;
          break;
        default:
          if (csv[key] === '"') {
            quote = !quote;
          } else if (csv[key] != "\r" && (csv[key] != " " || first === false)) current += csv[key];
      }
      key++;
      if (key === csv.length) end = true;
    } while (end === false);
    //console.log(keys);
    console.log(bells.length);
    ///*
    let nums = ["RingID","BellID","Weight(lbs)"];
    bells.forEach((arr,n) => {
      let o = {};
      keys.forEach((k,j) => {
        o[k] = nums.includes(k) ? Number(arr[j]) : arr[j];
      });
      let c = o["BellRole"].indexOf("c");
      if (c) { //i.e. c != 0
        if (c > 0) o["BellRole"] = o["BellRole"].slice(0,c);

        if (o["Weight(approx)"] === "Y") {
          o.weight = (o["Weight(lbs)"]/112)+"cwt";
        } else if (o["Weight(lbs)"] === 0) {
          o.weight = " ";
        } else {
          let wt = [Math.floor(o["Weight(lbs)"]/112)];
          wt.push(Math.floor((o["Weight(lbs)"]%112)/28));
          wt.push(Math.floor(o["Weight(lbs)"]%28));
          o.weight = wt.join("–");
        }
        let tower = towers.find(t => t.RingID === o.RingID);
        if (tower) {
          if (tower.bells) {
            tower.bells.push(o);
          } else {
            tower.bells = [o];
          }
        } else {
          console.log("couldn't find tower "+o.RingID);
        }
      }
    });

    let s = new stream.Readable();
    s.push(JSON.stringify(towers,null,2));
    s.push(null);
    s.pipe(fs.createWriteStream('src/towers.json')).on('finish', () => {
      if (key < csv.length) {
        console.log("next chunk");
        bells = [];
        arr = [];
        end = false;
        loop();
      } else {
        console.log(towers[100].bells);
        console.log("finished");
      }
    });
  //*/
  }
}