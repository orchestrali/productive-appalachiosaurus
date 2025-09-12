const nums = [{oldname: 'stage', newname: 'stage'}, {oldname: 'lengthOfLead', newname: 'leadLength'}, {oldname: 'numberOfHunts', newname: 'numHunts'}];
const used = ['stage', 'lengthOfLead', 'numberOfHunts', 'leadHead', 'leadHeadCode', 'symmetry', 'huntbellPath', 'classification', 'falseness', 'title', 'id', 'name', 'notation', 'references', 'performances', 'notes'];
const classify = require('./classify.js');
const addBooleans = require('./addBooleans.js');

module.exports = function handleProps(tokens, err) {
  let props = {};
  
  for (var i = 0; i < tokens.length; i++) {
    let discarded = [];
    
    if (nums.find(o => o.oldname == tokens[i].name)) {
      let newname = nums.find(o => o.oldname == tokens[i].name).newname;
      props[newname] = Number(tokens[i].value);
    } else if (tokens[i].name == 'leadHead' || tokens[i].name == 'leadHeadCode') {
      props[tokens[i].name] = tokens[i].value;
    } else if (tokens[i].name == 'symmetry') {
      props.symmetry = tokens[i].value.split(' ');
    } else if (tokens[i].name == 'huntbellPath') {
      props.huntPath = tokens[i].value.split(' ').map(x => Number(x));
    } else if (tokens[i].name == 'classification') {
      //let descrip = tokens.find(o => o.name == "notes") ? tokens.find(o => o.name == "notes").value : null;
      props.class = classify(tokens[i].value);
      props.classification = addBooleans(tokens[i].value);
    } else if (tokens[i].name == 'falseness') {
      if (tokens[i].value.fchGroups) {
        props.fchGroups = tokens[i].value.fchGroups;
      }
    } 
    if (used.indexOf(tokens[i].name) == -1) {
      discarded.push(tokens[i].name);
    }
    if (discarded.length > 0) {
      console.warn('discarded keys: ' + discarded);
      err.push({notes: "discarded keys", keys: discarded});
    }
  }
  return props;
}