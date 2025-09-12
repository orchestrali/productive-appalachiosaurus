var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var performanceSchema = new Schema({
  method: {type: Schema.Types.ObjectId, ref: 'method'},
  date: String,
  location: {
    room: String,
    building: String,
    address: String,
    town: String,
    county: String,
    region: String,
    country: String
  },
  numberOfChanges: Number,
  type: String,
  society: String,
  conductor: String,
  bbNum: Number
});

module.exports = mongoose.model('performance', performanceSchema);