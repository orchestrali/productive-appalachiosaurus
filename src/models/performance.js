var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//these aren't really performances; they're relationships between a method and a performance (first of some kind)

var performanceSchema = new Schema({
  method: {type: Schema.Types.ObjectId, ref: 'method'},
  methodTitle: String,
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

//type should be enum but given as string in case I don't know all the enum possibilities 
//["firstHandbellPeal", "firstInclusionInTowerbellPeal", "firstTowerbellExtent", "firstTowerbellPeal", "firstInclusionInHandbellPeal", "firstKeyboardQuarterPeal", "firstInclusionInTowerbellQuarterPeal", "firstInclusionInHandbellQuarterPeal", "firstInclusionInKeyboardQuarterPeal", "firstInclusionInKeyboardPeal"]

module.exports = mongoose.model('performance', performanceSchema);
