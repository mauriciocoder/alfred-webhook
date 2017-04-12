var mongoose = require("mongoose");
var Checkout = require("../models/checkout");

module.exports = mongoose.model("Checkout", {
  timestamp: String,
  totalStayFee: Number,
  totalOrdersFee: Number,
  userSpeech: String
});
