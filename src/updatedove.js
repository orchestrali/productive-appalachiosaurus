const axios = require('axios');
const fs = require('fs');
const decompress = require('decompress');
const rimraf = require('rimraf');
const doveformat = require("./doveformat.js");

var url = 'https://dove.cccbr.org.uk/dove.csv';
var url2 = 'https://dove.cccbr.org.uk/bells.csv?ring_type=english'

module.exports = function updateFiles(cb) {
  rimraf.sync("dove");
  fs.mkdirSync("dove");
  
  axios({
    method: 'get',
    url: url,
    responseType: 'stream'
  })
    .then((response) => {
      response.data.pipe(fs.createWriteStream('dove/towers.txt'))
        .on("close", () => {
          console.log("csv written");
          axios({
            method: 'get',
            url: url2,
            responseType: 'stream'
          })
          .then((res) => {
            res.data.pipe(fs.createWriteStream('dove/bells.csv'))
            .on("close", () => {
              doveformat();
            });
          });
          
        });
      })
    .catch((error) => {
      console.log(error);
    });
  
}