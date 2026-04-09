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
require('./src/postglitch/fixpn.js');
*/
const connect = require('./src/mongoose/connect.js');
const find = require('./src/find/findFields.js');
const getmethods = require('./src/getmethods.js');
const updatefiles = require('./src/updatefiles.js');
const router = require('./src/newrouter.js');
const testfunction = require('./src/postglitch/convertxml.js');
const buildhuntpaths = require('./src/postglitch/buildhuntpaths.js');
const testfortvs = require('./src/postglitch/testfortvs.js');
const buildtvpage = require('./src/postglitch/trivialvars.js');
// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

var db = connect();
var huntpage;
var tvresults;
var tvpage;
var jsonstring;

buildhuntpaths(page => {
  huntpage = page;
  //testfortvs(arr => tvresults = arr);
  //buildtvpage(html => tvpage = html);
  testfunction(false, null, (mm) => {
    jsonstring = mm; //JSON.stringify(mm, null, 2);
  });
});

//updatefiles(() => {});
//buildlocal();
//separate();
//router({}, Date.now(), null, () => {});
//updatedove();
//doveformat();
//update();
/*
NOTES
- need to update existing methods...performances, additional notes, etc.
- maybe I should just save a more recent xml file here for a bit so it doesn't have to be downloaded every time...
*/

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  
  response.sendFile(__dirname + "/views/index.html");
  
});

//build static page showing hunt bell paths
app.get("/hunts", (request, response) => {
  if (huntpage) {
    response.send(huntpage);
  } else {
    response.send("try again in a minute");
  }
});

//testing for trivial variations
app.get("/tvtest", (request, response) => {
  if (tvpage) {
    response.send(tvpage);
    //response.send(tvresults.map(o => o.title));
  } else {
    response.send("try again later");
  }
});

//tower data
app.get("/towers", (request, response) => {
  response.send(require("./src/towers.json"));
});

//file(s) for changeringing.net??
app.get("/methods", (request, response) => {
  if (db) {
    getmethods((res) => {
      response.send(res);
    });
  }
});

//for tracking what's in the database
app.get("/ccnums", (request, response) => {
  if (db) {
    let query = {query: {}, fields: "ccNum"};
    find("method", query, (res) => {
      response.send(res);
    });
  }
});

//trigger download of CCCBR method file & database update
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


app.get("/ccjson", (request, response) => {
  if (jsonstring) {
    response.json(jsonstring);
    //response.send(tvresults.map(o => o.title));
  } else {
    response.send("try again later");
  }
});

/*
var time;
app.get("/testing", (request, response) => {
  //response.send("OK");
  let now = Date.now();
  if (!time || now-time > 60000) {
    time = now;
    
    
  } else {
    console.log("already going? or already went?");
    response.send("timing issue");
  }
});
*/

//old thing:
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
