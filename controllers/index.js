var express = require("express");
var router = express.Router();
var ApiAiAssistant = require("actions-on-google").ApiAiAssistant;
var Food = require("../models/food");
var Order = require("../models/order");

module.exports = function() {
  router.post("/", function(req, res) {
    var assistant = new ApiAiAssistant({request: req, response: res});
    // check autentication
    // fulfill action business logic
    function responseHandler (assistant) {
      var intent = req.body.result.metadata.intentName;
      console.log("intent invocada: " + intent);
      switch (intent) {
        case "food.order": 
          orderFood(req, assistant);
          break;
        case "menu.show":
          showMenu(assistant);
          break;
      }
    };
    assistant.handleRequest(responseHandler);
  });
  
  router.post("/newfood", function(req, res) {
    var food = new Food();
    food.name = "double cheeseburguer"
    food.save(function(err) {
      return;
    });
  });
  
  /*
  router.use("/register", require("./register")(passport));
  */
  return router;
}

var showMenu = function(assistant) {
  console.log("entrou em showMenu");
  Food.find({}, function(assistant, err, foods) { 
    var foodsString = foods.map(function(food, i) {
        var s = "";
        if (i > 0) {
          s += ",";
        }
        s += food.name;
        return s;
    })
    assistant.tell("Sure. In our menu we have " + foodsString);    
  }.bind(null, assistant));
}

var orderFood = function(req, assistant) {
  console.log("entrou em orderFood");
  var foodOrdered = req.body.result.parameters.food;
  console.log("food pedida: " + foodOrdered);
  var userSpeech = req.body.result.resolvedQuery;
  console.log("userSpeech: " + userSpeech);
  var timestamp = req.body.timestamp;
  console.log("timestamp: " + timestamp);
  
  var order = new Order();
    order.food = foodOrdered;
    order.timestamp = timestamp;
    order.userSpeech = userSpeech;
    order.save(function(err) {
      assistant.tell("Thanks for rodering, your " + foodOrdered + " will be served in your room in under 20 minutes");    
    });
  return;
}
