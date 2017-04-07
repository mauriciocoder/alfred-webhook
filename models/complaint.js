var mongoose = require("mongoose");
var Complaint = require("../models/complaint");

module.exports = mongoose.model("Complaint", {
  timestamp: String,
  userSpeech: String
});
