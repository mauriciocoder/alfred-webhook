var mongoose = require("mongoose");
var Order = require("../models/order");

module.exports = mongoose.model("Order", {
  food: String,
  timestamp: String,
  userSpeech: String
});
