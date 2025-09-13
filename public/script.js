// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");

// define variables that reference elements on our page
const dreamsList = document.getElementById("dreams");
const dreamsForm = document.querySelector("form");

$(function() {
  
});

// fetch the initial list of dreams
fetch("/methods")
  .then(response => response.json()) // parse the JSON from the server
  .then(dreams => {
    // remove the loading text
    $("#dreams").text("methods ready");
  
  });
