var Complaint = require('../models/complaint');

module.exports = function(req, assistant) {
  var complaint = new Complaint();
  complaint.userSpeech = req.body.result.resolvedQuery;
  var timestamp = req.body.timestamp;
  complaint.timestamp = timestamp;
  complaint.save(function(err) {
      assistant.ask('So, you have a complaint. Your message is registered and our staff will reach you as soon as possible. Would you like anything else?');    
  });
}