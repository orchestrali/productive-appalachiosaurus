const axios = require('axios');
const fs = require('fs');
const decompress = require('decompress');
const rimraf = require('rimraf');
const xmlToJson = require('xml-to-json-stream');
const stream = xmlToJson().createStream();

var url = 'https://cccbr.github.io/methods-library/xml/CCCBR_methods.xml.zip';

module.exports = function updateFiles(cb) {
  rimraf.sync("work");
  fs.mkdirSync("work");
  
  axios({
    method: 'get',
    url: url,
    responseType: 'stream'
  })
    .then((response) => {
      response.data.pipe(fs.createWriteStream('work/download.zip'))
        .on("close", () => {
          console.log("file downloaded");
          decompress("work/download.zip", "work")
            .then(files => {
              console.log("file unzipped");
              let input = fs.createReadStream('work/CCCBR_methods.xml');
				      let output = fs.createWriteStream('work/collection.json');
              input.pipe(stream).pipe(output).on("finish", () => {
                console.log("finished?");
                cb();
              });
            });
        });
      })
    .catch((error) => {
      console.log(error);
    });
  
}