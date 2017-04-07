var mongoose = require("mongoose");
var Event = require("../models/event");

module.exports = mongoose.model("Event", {
  type: String,
  startTime: Date,
  endTime: Date
});
