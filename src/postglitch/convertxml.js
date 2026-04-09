const fs = require("fs");
const rimraf = require('rimraf');
const xmlToJson = require('xml-to-json-stream');
const stream = xmlToJson().createStream();

const parse = require('../parser/router.js');

module.exports = function bignewfn(full, ii, cb) {
  rimraf.sync("work");
  fs.mkdirSync("work");

  let input = fs.createReadStream('src/CCCBR_methods-2026-04-09.xml');
  let output = fs.createWriteStream('work/collection.json');
  input.pipe(stream).pipe(output).on("finish", () => {
    console.log("converted xml to json");
    parsecollection(full, ii, cb);
  });
}


function parsecollection(full, ii, cb) {
  let file = JSON.parse(fs.readFileSync("work/collection.json"));
  let collection = file.collection.methodSet;
  if (ii) collection = collection.slice(ii[0],ii[1]);
  console.log(collection.length+" methodSets");
  let methods = [];
  let i = 1;
  let f = full ? parse : require("../parser/routerminimal.js");
  while (collection.length) {
    let set = collection.shift();
    console.log("methodSet "+i);
    let res = f(set);
    methods.push(...res.methods);
    i++;
  }
  cb(methods);
}

