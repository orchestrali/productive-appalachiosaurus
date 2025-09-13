const mongoose = require('mongoose');

//input "titles" has method titles and mongoose ids that correspond
module.exports = function addIDs(method, titles) {
  //potential keys: newtitle, title, performances
  let results = {};
  let t = titles.findIndex(i => i.title.toLowerCase() === method.title.toLowerCase());
  if (t >= 0) {
    method._id = titles[t].string;
    titles.splice(t, 1);
  } else {
    if (method.oldtitle && !Array.isArray(method.oldtitle)) method.oldtitle = [method.oldtitle];
    t = method.oldtitle ? titles.findIndex(o => method.oldtitle.find(i => i.toLowerCase() === o.title.toLowerCase())) : -1;
    if (t > -1) {
      console.log(method.title + "("+method.oldtitle+")");
      method._id = titles[t].string;
      results.newtitle = {_id: titles[t]._id, title: method.title};
      titles.splice(t, 1);
    } else {
      console.log(method.title);
      method._id = new mongoose.Types.ObjectId();
      results.title = {title: method.title, string: method._id, type: "method"};
    }
  }
  
  
  let ids = [];
  let performances = [];
  
  if (method.performances) {
    for (let i = 0; i < method.performances.length; i++) {
      method.performances[i].method = method._id; 
      method.performances[i]._id = new mongoose.Types.ObjectId();
      ids.push(method.performances[i]._id);
      performances.push(method.performances[i]);
    }
    method.performances = ids;
  }
  results.performances = performances;
  
  return results;
}
