var express = require('express');
var moment = require('moment');
var router = express.Router();
var ApiAiAssistant = require('actions-on-google').ApiAiAssistant;
var Order = require('../models/order');
var Event = require('../models/event');
var Wifi = require('../models/wifi');
var Complaint = require('../models/complaint');
var Food = require('../models/food');

module.exports = function() {
  router.post('/', function(req, res) {
    var assistant = new ApiAiAssistant({request: req, response: res});
    // check autentication
    // fulfill action business logic
    function responseHandler (assistant) {
      var intentName = req.body.result.metadata.intentName;
      console.log('intent invocada: ' + intentName);
      intent[intentName](req, assistant);
    };
    assistant.handleRequest(responseHandler);
  });
  
  /*
  router.use('/register', require('./register')(passport));
  */
  return router;
}

var intent = {};
intent.breakfast_time = function (req, assistant) {
  console.log('entrou em breakfast_time');
  Event.find({type: 'breakfast'}, function(assistant, err, event) { 
    event = event[0];
    var startTime = moment(event.startTime).format('LT');
    var endTime = moment(event.endTime).format('LT');
    var message = 'The breakfast is served everyday from ' + startTime + ' to ' + endTime + '. Would you like anything else?';
    assistant.ask(message);    
  }.bind(null, assistant));
}

intent.wifi_ask = function (req, assistant) {
  console.log('entrou em wifi_ask');
  Wifi.find({}, function(assistant, err, wifi) { 
    wifi = wifi[0];
    var message = 'The wifi login is ' + wifi.login + ' and the password is ' + wifi.password + '. Would you like anything else?';
    assistant.ask(message);    
  }.bind(null, assistant));
}

intent.complaint_order = function (req, assistant) {
  var complaint = new Complaint();
  complaint.userSpeech = req.body.result.resolvedQuery;
  var timestamp = req.body.timestamp;
  console.log('timestamp: ' + timestamp);
  complaint.timestamp = timestamp;
  complaint.save(function(err) {
      assistant.ask('So, you have a complaint. Your message is registered and our staff will reach you as soon as possible. Would you like anything else?');    
  });
}

intent.food_order = function (req, assistant) {
  var order = new Order();
  var userSpeech = req.body.result.resolvedQuery;
  order.userSpeech = userSpeech;
  var timestamp = req.body.timestamp;
  order.timestamp = timestamp;
  var foods = [];
  var food = req.body.result.parameters.menu_food;
  var food1 = req.body.result.parameters.menu_food1;
  var food2 = req.body.result.parameters.menu_food2;
  add(foods, food, food1, food2);
  order.foods = foods;
  Food.find({ name : { $in : order.foods } }, function(assistant, err, foods) {
    var totalPrice = foods.reduce(function(acc, food) {
      return acc + food.price;
    }, 0); 
    order.price = totalPrice;
    order.save(function(err) {
      assistant.ask('Sure. I will ask the kitchen to bring ' + order.foods + ' for you in your room. Would you like anything else?');    
    });
  }.bind(null, assistant));
}

function add() {
  var foodsArr = arguments[0];
  for (var i = 1; i < arguments.length; i++) {
    var food = arguments[i];
    if (food.length > 0) {
      foodsArr.push(food);
    }
  }
}
