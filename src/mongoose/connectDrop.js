const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+'/'+process.env.DB+'?retryWrites=true';
const dbName = process.env.DB;


module.exports = function connectDrop(drop, cb) {
  mongoose.connect(uri, {dbName: dbName, useNewUrlParser: true, useUnifiedTopology: true});
  let db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  console.log('attempting to drop collection');
 
  let i = 0;
  drops(drop[i]);
  
  function drops(coll) {
    db.dropCollection(coll, (err) => {
      if (err) console.error(err);
      i++;
      if (i < drop.length) {
        drops(drop[i]);
      } else {
        cb(db);
      }
      
    });
    
  }
  
  
}