

module.exports = function find(mod, query, cb) {
  //console.log("searching for "+ mod + "s");
  let model = require('../models/'+mod+'.js');
  
  model.find(query, function (err, results) {
    if (err) {
      console.log(err);
      cb([]);
    }
    //console.log("number of calls: " + results.length);
    cb(results);
    
  });
}