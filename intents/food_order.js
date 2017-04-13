var Order = require('../models/order');
var Food = require('../models/food');

module.exports = function(req, assistant) {
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

function add() {
  var foodsArr = arguments[0];
  for (var i = 1; i < arguments.length; i++) {
    var food = arguments[i];
    if (food.length > 0) {
      foodsArr.push(food);
    }
  }
}