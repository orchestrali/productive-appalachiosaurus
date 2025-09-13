// client-side js, loaded by index.html
// run by the browser each time the page is loaded


var methodfile;
var updateresults;
var shortmethods;


$(function() {
  console.log("hello world :o");
  $("#getmethods").on("click", getmethods);
  $("#downloadfiles").on("click", triggerdownload);
});



function triggerdownload() {
  let keys = ["title", "stage", "class", "leadLength", "leadHeadCode", "pnFull", "huntBells", "pbOrder"];
  let mapping = {
    title: "name",
    huntBells: "hunts",
    pnFull: "plainPN"
  };
  let url = "/download?secret="+ $("#secret").val();
  $("#download").children().remove();
  $("#download").append(`<p id="loading">sending...</p>`);
  fetch(url)
  .then(response => response.json())
  .then(res => {
    updateresults = [];
    res.methods.forEach(m => {
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
    shortmethods = JSON.stringify(updateresults);
    $("#loading").text("done");
    $("#download").append(`<button id="viewresults">view results</button>`);
    $("#viewresults").on("click", viewfile);
  });
}

function viewfile(e) {
  if (e.currentTarget.id === "viewresults") {
    openfile(shortmethods);
  }
}

function getmethods() {
  $("#container").children().remove();
  $("#container").append(`<p>loading file...</p>`);
  fetch("/methods")
  .then(response => response.json())
  .then(methods => {
    methodfile = JSON.stringify(methods);
    // remove the loading text
    $("#container").children().remove();
    $("#container").append(`<button id="getfile">get file</button>`);
    $("#getfile").on("click", downloadfile);
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
