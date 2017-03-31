var mongoose = require("mongoose");
var Food = require("../models/food");

module.exports = mongoose.model("Food", {
  name: String
});