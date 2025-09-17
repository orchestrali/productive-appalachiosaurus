// client-side js, loaded by index.html
// run by the browser each time the page is loaded

var ccnums;
var methodnamelist;
//complete method file for changeringing.net
var methodfile;
//holder for new methods added to database
var updateresults;
//stringified version
var shortmethods;

var stedmanstages = ["Doubles","Triples","Caters","Cinques","Sextuples","Septuples"];
const stedmans = stedmanstages.map(s => "Stedman "+s);

$(function() {
  console.log("hello world :o");
  $("#getmethods").on("click", getmethods);
  $("#getccnums").on("click", getccnums);
  $("#downloadfiles").on("click", triggerdownload);
});


//tell server to download method file and process any new methods
function triggerdownload() {
  let keys = ["title", "stage", "class", "leadLength", "leadHeadCode", "pnFull", "huntBells", "pbOrder", "ccNum"];
  let mapping = {
    title: "name",
    huntBells: "hunts",
    pnFull: "plainPN"
  };
  let url = "/download?secret="+ $("#secret").val();
  $("#download").children().remove();
  $("#download").append(`<p id="loading">sending...</p>`);
  let nums = [];
  let max = 50000;
  fetch(url)
  .then(response => response.json())
  .then(res => {
    updateresults = [];
    res.methods.forEach(m => {
      nums.push(m.ccNum);
      let o = {};
      keys.forEach(k => {
        if (mapping[k]) {
          o[mapping[k]] = m[k];
        } else {
          o[k] = m[k];
        }
      });
      updateresults.push(o);
    });
    shortmethods = JSON.stringify(updateresults, null, 2).replace(/\n      +/g, "").replace(/\n    \]/g, "]");
    $("#loading").text("done, "+nums.length+" new methods");
    $("#download").append(`<ul>${nums.map(n => "<li>"+n+",</li>")}</ul>`);
    $("#download").append(`<button id="viewresults">view results</button>`);
    $("#viewresults").on("click", viewfile);
  });
}

function viewfile(e) {
  let files = {
    viewresults: shortmethods,
    namelist: methodnamelist,
    numlist: ccnums
  };
  let file = files[e.currentTarget.id];
  if (file) {
    openfile(file);
  }
}

function getccnums() {
  $("#container").children().remove();
  $("#container").append(`<p>loading file...</p>`);
  fetch("/ccnums")
  .then(response => response.json())
  .then(ccnums => {
    let cc = ccnums.map(o => o.ccNum).sort((a,b) => a-b);
    ccnums = JSON.stringify(cc, null, 2);
    $("#container").children().remove();
    $("#container").append(`<button id="numlist">get ccNum list</button>`);
    $("#numlist").on("click", viewfile);
  });
}

//get current list of methods formatted for mini-instinctive-metal
function getmethods() {
  $("#container").children().remove();
  $("#container").append(`<p>loading file...</p>`);
  fetch("/methods")
  .then(response => response.json())
  .then(methods => {
    let namelist = buildnamelist(methods);
    methodnamelist = JSON.stringify(namelist, null, 2);
    let cc = methods.map(o => o.ccNum).sort((a,b) => a-b);
    
    stedmans.forEach(t => {
      let m = methods.find(o => o.name === t);
      let other = methods.find(o => o.name === "Reverse "+t);
      m.stedman = true;
      if (other) other.stedman = true;
    });
    methodfile = JSON.stringify(methods, null, 2).replace(/\n      +/g, "").replace(/\n    \]/g, "]");
    // remove the loading text
    $("#container").children().remove();
    let buttons = {
      getfile: "get big method file",
      namelist: "get method names",
      //numlist: "get ccNum list"
    };
    for (let key in buttons) {
      let c = key === "getfile" ? "" : ` class="open"`;
      $("#container").append(`<button id="${key}"${c}>${buttons[key]}</button>`);
    }
    $("#getfile").on("click", downloadfile);
    $(".open").on("click", viewfile);
  });
}

function openfile(file) {
  const a = document.createElement('a');
  const blob = new Blob([file], {type: "text/plain"});
  a.href = URL.createObjectURL(blob);
  a.target = "_blank";
  a.click();

  URL.revokeObjectURL(a.href);
}

function downloadfile() {
  const a = document.createElement('a');
  const blob = new Blob([methodfile], {type: "text/plain"});
  a.href = URL.createObjectURL(blob);
  a.download = "methods.json";
  a.click();

  URL.revokeObjectURL(a.href);
}

function buildnamelist(arr) {
  let res = [];
  arr.forEach(m => {
    let so = res.find(o => o.stage === m.stage);
    if (so) {
      let co = so.classes.find(o => o.class === m.class);
      if (co) {
        if (co.methods.includes(m.name)) {
          console.log("duplicate: "+m.name);
        } else {
          co.methods.push(m.name);
        }
      } else {
        co = {
          class: m.class,
          methods: [m.name]
        };
        so.classes.push(co);
      }
    } else {
      let o = {
        stage: m.stage,
        classes: [
          {
            class: m.class,
            methods: [m.name]
          }
        ]
      };
      res.push(o);
    }
  });
  res.sort((a,b) => a.stage - b.stage);
  return res;
}
