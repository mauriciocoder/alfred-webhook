var mongoose = require("mongoose");
var Fee = require("../models/fee");

module.exports = mongoose.model("Fee", {
  price: Number
});
