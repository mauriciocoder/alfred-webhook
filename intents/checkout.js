var Fee = require('../models/fee');
var Event = require('../models/event');
var Order = require('../models/order');
var Checkout = require('../models/checkout');
var moment = require('moment');

module.exports = function(req, assistant) {
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
            message += 'Your stay fee is ' + totalStayFee + ' dolars. Your orders fee is ' + totalOrdersFee + ' dolars. Summing up you have a total fee of ' + totalFee + ' dolars. Now, the Hotels Front Desk will get in touch with you in just a while';
            assistant.ask(message);
          });
        });
      }); 
    } else {
      var message = 'I will tell you how checkout works in our hotel. We have two types of checkouts: regular checkout and late checkout.'
        + 'Regular checkout is the checkout confirmed before ' + startTime + '. '
        + 'Between ' + startTime + ' to ' + endTime + ' a half-day room charge is incurred, for what we call late check-out. '
        + ' A full day room charge is incurred for check-out after ' + endTime + '.';
      assistant.ask(message);    
    }
  });
}