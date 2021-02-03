var db = require("./index.js");

var mongoose = require("mongoose");

var photosSchema = new mongoose.Schema({
  id: {type: Number, unique: true},
  review_id: Number,
  url: String
});

// var charsSchema = new mongoose.Schema({
//   characteristic_id: Number,
//   value: Number,
//   characteristic_name: String
// });

var reviewSchema = new mongoose.Schema({
  product_id: Number,
  rating: Number,
  recommend: Boolean,
  reported: Boolean,
  response: String,
  summary: String,
  body: String,
  date: String,
  reviewer_name: String,
  helpfulness: Number,
  photos: [photosSchema],
  characteristic_reviews: [{
    characteristic_id: Number,
    value: Number,
    characteristic_name: String
  }]
});

// Register the pokemonSchema with Mongoose as the 'Pokemon' model.
var Review = mongoose.model('Review', reviewSchema, 'reviewsChPh');


module.exports = Review;