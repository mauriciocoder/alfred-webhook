var express = require('express');
var moment = require('moment');
var router = express.Router();
var ApiAiAssistant = require('actions-on-google').ApiAiAssistant;
var Order = require('../models/order');
var Event = require('../models/event');
var Wifi = require('../models/wifi');
var Complaint = require('../models/complaint');
var Food = require('../models/food');
var Fee = require('../models/fee');
var Checkout = require('../models/checkout');

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
  Event.find({type: 'breakfast'}, function(err, event) { 
    event = event[0];
    var startTime = moment(event.startTime).format('LT');
    var endTime = moment(event.endTime).format('LT');
    var message = 'The breakfast is served everyday from ' + startTime + ' to ' + endTime + '. Would you like anything else?';
    assistant.ask(message);    
  });
}

intent.wifi_ask = function (req, assistant) {
  Wifi.find({}, function(err, wifi) { 
    wifi = wifi[0];
    var message = 'The wifi login is ' + wifi.login + ' and the password is ' + wifi.password + '. Would you like anything else?';
    assistant.ask(message);    
  });
}

intent.complaint_order = function (req, assistant) {
  var complaint = new Complaint();
  complaint.userSpeech = req.body.result.resolvedQuery;
  var timestamp = req.body.timestamp;
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
  Food.find({ name : { $in : order.foods } }, function(err, foods) {
    var totalPrice = foods.reduce(function(acc, food) {
      return acc + food.price;
    }, 0); 
    order.price = totalPrice;
    order.save(function(err) {
      assistant.ask('Sure. I will ask the kitchen to bring ' + order.foods + ' for you in your room. Would you like anything else?');    
    });
  });
}

intent.checkout = function (req, assistant) {
  var userSpeech = req.body.result.resolvedQuery;
  var timestamp = req.body.timestamp;
  var checkoutAction = req.body.result.parameters.checkout_verb;
  Event.find({type: 'checkout'}, function(err, event) { 
    event = event[0];
    var startTime = moment(event.startTime).format('LT');
    var endTime = moment(event.endTime).format('LT');
    if ('proceed'.toUpperCase() === checkoutAction.toUpperCase()) {
      Fee.find({}, function(err, fee) {
        var checkoutTimeText = moment(timestamp).format('LT');
        var checkoutTime = moment(checkoutTimeText, 'h:mm a');
        startTime = moment(startTime, 'h:mm a');
        endTime = moment(endTime, 'h:mm a');
        var message = 'Sure sir. Your checkout was done at ' + checkoutTimeText + '. By doing so, your checkout is ';
        var multiplier = 1;
        if (checkoutTime.isBefore(startTime)) {
          message += 'a regular checkout.';
        } else if (checkoutTime.isBefore(endTime)) {
          message += 'a late checkout.';
          multiplier = 1.5;
        } else {
          message += 'an after late checkout.';
          multiplier = 2;
        }
        var totalStayFee = fee[0].price * multiplier;
        Order.find({}, function(err, orders) {
          var totalOrdersFee = orders.reduce(function(acc, order) {
            return acc + order.price;
          }, 0);
          var totalFee = totalOrdersFee + totalStayFee;
          var checkout = new Checkout();
          checkout.timestamp = timestamp;
          checkout.totalStayFee = totalStayFee;
          checkout.totalOrdersFee = totalOrdersFee;
          checkout.userSpeech = userSpeech;
          checkout.save(function(err) {
            message += 'Your stay fee is ' + totalStayFee + ' dolares. Your orders fee is ' + totalOrdersFee + ' dolares. Summing up you have a total fee of ' + totalFee + ' dolares. Now, the Hotels Front Desk will get in touch with you in just a while';
            assistant.ask(message);
          });
        });
      }); 
    } else {
      var message = 'I will tell you how checkout works in our hotel. We have two types of checkouts: regular checkout and late checkout.'
        + 'Regular checkout is the checkout confirmed before ' + startTime + '. '
        + 'Between ' + startTime + ' to ' + endTime + ' a half-day room charge is incurred for what we call late check-out. '
        + ' A full day room charge is incurred for check-out after ' + endTime + '.';
      assistant.ask(message);    
    }
  });
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
