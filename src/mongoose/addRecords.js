

module.exports = function addRecords(arr, model, cb) {
	let mod = require('../models/'+model+'.js');
  
  insertLoop();
  
  function insertLoop() {
    
    mod.insertMany(arr.slice(0, 2000), (err, docs) => {
      if (err) console.error(err.errmsg);
      arr.splice(0, 2000);
      console.log('some records added');
      if (arr.length > 0) {
        insertLoop();
      } else {
        cb();
      }
    });
    
  }
	

}