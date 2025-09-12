const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+'/'+process.env.DB+'?retryWrites=true';
const dbName = process.env.DB;

module.exports = function connect() {
  console.log('attempting to connect to mongoDB');
  mongoose.connect(uri, {dbName: dbName, useNewUrlParser: true, useUnifiedTopology: true});
  let db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  
  return db;
}