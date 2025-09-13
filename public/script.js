// client-side js, loaded by index.html
// run by the browser each time the page is loaded


var methodfile;


$(function() {
  console.log("hello world :o");
  $("#getmethods").on("click", getmethods);
});

// fetch the initial list of dreams



function getmethods() {
  $("#container").children().remove();
  $("#container").append(`<p>loading file...</p>`);
  fetch("/methods")
  .then(response => {
    methodfile = response;
    // remove the loading text
    $("#container").children().remove();
    $("#container").append(`<button id="getfile">get file</button>`);
    $("#getfile").on("click", downloadfile);
  });
}

function downloadfile() {
  const a = document.createElement('a');
  const blob = new Blob([methodfile], {type: "text/plain"});
  a.href = URL.createObjectURL(blob);
  a.download = "methods.json";
  a.click();

  URL.revokeObjectURL(a.href);
}
