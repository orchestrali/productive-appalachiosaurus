const fs = require('fs');
const stream = require('stream');

module.exports = function filterCollection(cb) {
  
  if (fs.existsSync('work/collection.json')) {
		let collection = JSON.parse(fs.readFileSync('work/collection.json')).collection.methodSet;
    let methodlist = JSON.parse(fs.readFileSync('src/methodlist.json'));
    
    let i = collection.length-1;
    while (i >= 0) {
      if (Array.isArray(collection[i].method)) {
        collection[i].method = collection[i].method.filter(o => !methodlist.find(m => m.ccNum === Number(o.id.slice(1))));
        if (collection[i].method.length === 0) {
          collection.splice(i, 1);
          console.log("methodSet "+(i+1)+", no new methods");
        } else {
          console.log("methodSet "+(i+1)+", num new methods: "+collection[i].method.length);
        }
      } else {
        if (methodlist.find(o => o.ccNum === Number(collection[i].method.id.slice(1)))) {
          collection.splice(i, 1);
          console.log("methodSet "+(i+1)+", no new methods");
        } else {
          collection[i].method = [collection[i].method];
          console.log("methodSet "+(i+1)+", num new methods: 1");
        }
      }
      i--;
    }
    let s = new stream.Readable();
    s.push(JSON.stringify(collection, null, 2));
    s.push(null);
    s.pipe(fs.createWriteStream('work/newmethods.json')).on('finish', () => {
      console.log("finished");
      cb('work/newmethods.json');
    });
    
  }
  
}