var mongoose = require("mongoose");
var Order = require("../models/order");

module.exports = mongoose.model("Order", {
  foods: [String],
  timestamp: String,
  userSpeech: String
});
