var mongoose = require("mongoose");
var Wifi = require("../models/wifi");

module.exports = mongoose.model("Wifi", {
  login: String,
  password: String,
});
