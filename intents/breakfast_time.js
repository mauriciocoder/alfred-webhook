var Event = require('../models/event');
var moment = require('moment');

module.exports = function(req, assistant) {
  Event.find({type: 'breakfast'}, function(err, event) { 
    event = event[0];
    var startTime = moment(event.startTime).format('LT');
    var endTime = moment(event.endTime).format('LT');
    var message = 'The breakfast is served everyday from ' + startTime + ' to ' + endTime + '. Would you like anything else?';
    assistant.ask(message);    
  });
}