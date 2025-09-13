// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const bodyParser = require('body-parser');

/*
const router = require('./src/router.js');
const buildlocal = require('./src/buildlocal.js');
const filter = require('./src/filterDatabase.js');
const courseorder = require('./src/courseorder/courseorders.js');

const updatedove = require('./src/updatedove.js');
const doveformat = require('./src/dovebells.js');
const separate = require('./src/separate.js');
const update = require('./src/temporary.js');
*/
const connect = require('./src/mongoose/connect.js');
const getmethods = require('./src/getmethods.js');
const updatefiles = require('./src/updatefiles.js');
const router = require('./src/newrouter.js');
// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

var db;
//updatefiles(() => {});
//buildlocal();
//separate();
//router({}, Date.now(), null, () => {});
//updatedove();
//doveformat();
//update();

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  
  response.sendFile(__dirname + "/views/index.html");
  db = connect();
});

app.get("/towers", (request, response) => {
  response.send(require("./src/towers.json"));
});

app.get("/methods", (request, response) => {
  if (db) {
    getmethods((res) => {
      response.send(res);
    });
  }
});

app.get("/download", (request, response) => {
  if (request.query.secret === process.env.SECRET) {
    //download, filter, callback
    router(true, true, (res) => {
      response.send(res);
    });
  } else {
    response.send("bad secret");
  }
});

let methods = false;
app.get('/'+process.env.SECRET, function(request, response) {
  console.log(request.query);
  console.log("get!");
  /*
  if (!methods) {
    methods = true;
    router(request.query, Date.now(), true, () => {
      methods = false;
      buildlocal();
    });
  }
  */
  response.sendStatus(200);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
