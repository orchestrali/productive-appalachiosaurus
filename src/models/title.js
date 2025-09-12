var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var titleschema = new Schema({
  title: String,
  string: String,
  type: String
});


module.exports = mongoose.model('title', titleschema);