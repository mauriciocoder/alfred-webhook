var express = require("express");
var router = express.Router();
var ApiAiAssistant = require("actions-on-google").ApiAiAssistant;

module.exports = function() {
  router.post("/", function(req, res) {
    console.log("Chegou aki!!!");
    const assistant = new ApiAiAssistant({request: req, response: res});
    // check autentication
    // fulfill action business logic
    function responseHandler (assistant) {
      assistant.tell("Sure. In our menu we have hamburguer and cheeseburguer! It was a webservice that told me!!!");
    };
    assistant.handleRequest(responseHandler);
  });
  /*
  router.use("/register", require("./register")(passport));
  */
  return router;
}
