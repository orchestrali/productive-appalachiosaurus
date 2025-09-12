const fs = require('fs');
const stream = require('stream');

module.exports = function filterCollection(cb) {
  
  if (fs.existsSync('work/collection.json')) {
		let collection = JSON.parse(fs.readFileSync('work/collection.json')).collection.methodSet;
    let methodlist = JSON.parse(fs.readFileSync('src/methodlist.json'));
    let extra = [];
    let titles = [];
    
    
    for (let i = 0; i < collection.length; i++) {
      if (Array.isArray(collection[i].method)) {
        titles = titles.concat(collection[i].method.map(o => o.title));
      } else {
        titles.push(collection[i].method.title);
      }
    }
    for (let i = 0; i < methodlist.length; i++) {
      let title = methodlist[i].title;
      if (!titles.includes(title)) {
        extra.push(title);
        console.log(title);
      }
    }
    console.log("finished");
    /*
    let s = new stream.Readable();
    s.push(JSON.stringify(collection, null, 2));
    s.push(null);
    s.pipe(fs.createWriteStream('work/newmethods.json')).on('finish', () => {
      console.log("finished");
      cb('work/newmethods.json');
    });
    */
  }
  
}