var express = require('express');
var router = express.Router();
var ApiAiAssistant = require('actions-on-google').ApiAiAssistant;

module.exports = function() {
  router.post('/', function(req, res) {
    var assistant = new ApiAiAssistant({request: req, response: res});
    function responseHandler (assistant) {
      var intentName = req.body.result.metadata.intentName;
      console.log('intent invocada: ' + intentName);
      require('../intents/' + intentName)(req, assistant);
    };
    assistant.handleRequest(responseHandler);
  });
  return router;
}
