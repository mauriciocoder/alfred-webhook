var mongoose = require("mongoose");
var FullOrder = require("../models/fullorder");

module.exports = mongoose.model("FullOrder", {
  foods: [String],
  timestamp: String,
  userSpeech: String
});
