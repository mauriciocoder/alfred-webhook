var express = require("express");
var app = express();

process.env.DEBUG = "actions-on-google:*";
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({type: "application/json"}));

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
// Forbidden to change stack order!!!
/*
var flash = require("connect-flash");
app.use(flash());
*/
// Mongoose Config
var mongoose = require("mongoose");
//var dbUrl = process.env.ALFRED_DB_URL;
var dbUrl = "mongodb://mauriciocoder:mlb310586@ds143980.mlab.com:43980/alfred-db";
mongoose.connect(dbUrl);

/*
// Configuring passport
var passport = require("passport");
var expressSession = require("express-session");
// TODO - Why Do we need this key ?
app.use(expressSession({secret: "MySecretKey"}));
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

// Mustache Config
var mustacheExpress = require("mustache-express");
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");
*/
//app.use(express.static("public"));
//app.use(require('./middlewares/users'))
app.use(require("./controllers")());

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("dbUrl = " + dbUrl);
  console.log("alfred-webhook Listening on port " + port);
});