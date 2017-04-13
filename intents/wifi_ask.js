var Wifi = require('../models/wifi');

module.exports = function(req, assistant) {
  Wifi.find({}, function(err, wifi) { 
    wifi = wifi[0];
    var message = 'The wifi login is ' + wifi.login + ' and the password is ' + wifi.password + '. Would you like anything else?';
    assistant.ask(message);    
  });
}