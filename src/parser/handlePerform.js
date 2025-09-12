const text = ['date', 'society', 'conductor', 'location'];
const used = ['date', 'society', 'conductor', 'id', 'location', 'numberOfChanges'];

//date, location, numberOfChanges, society, conductor, bbNum
module.exports = function handlePerform(p, tokens, err) {
  
  for (var i = 0; i < tokens.length; i++) {
    let discarded = [];
    
    if (tokens[i].name == 'society') {
      p[tokens[i].name] = tokens[i].value.replace(/&amp;/gi, "&");
    } else if (text.indexOf(tokens[i].name) > -1) {
      p[tokens[i].name] = tokens[i].value;
    } else if (tokens[i].name == 'numberOfChanges') {
      p.numberOfChanges = Number(tokens[i].value);
    } else if (tokens[i].name == 'id') {
      if (tokens[i].value.substring(0,2) != 'bb') {
        console.log('not a bellboard ID: ' + tokens[i].value);
        err.push({notes: "performance ID not from bellboard", id: tokens[i].value});
      }
      p.bbNum = Number(tokens[i].value.substring(2));
    } 

    if (used.indexOf(tokens[i].name) == -1) {
      discarded.push(tokens[i].name);
    }
    if (discarded.length > 0) {
      console.warn('performance discarded keys: ' + discarded);
    }
  }
  
  
  return p;
}