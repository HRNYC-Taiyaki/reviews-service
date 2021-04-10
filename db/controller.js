var Review = require("./reviewSchema.js");

exports.getReviews = function (req, res) {

  let product_id = req.query.product_id;
  let page = req.query.page || 1
  let count = parseInt(req.query.count) || 5
  let skip = (page - 1) * count;
  let sorted = '';
  if (req.query.sort === "newest") {
    sorted = [['date', -1]]
  }
  if (req.query.sort === "helpful") {
    sorted = [['helpfulness', -1]]
  }

  if (!product_id) {
    res.status(500).send('Invalid product ID')
  }

  Review.find({product_id: product_id}).where({ "reported": { "$ne": true }}).sort(sorted).limit(count).skip(skip)
  .then((result) => {
    let resultObj = {
      product: product_id,
      page: page,
      count: count,
      results: []
    }

    let formattedResults = result.map((review) => {
      return {
        review_id: review._id,
        rating: review.rating,
        summary: review.summary,
        recommend: review.recommend,
        reported: review.reported,
        response: review.response,
        body: review.body,
        date: review.date,
        reviewer_name: review.reviewer_name,
        helpfulness: review.helpfulness,
        photos: review.photos
      }
    })

    resultObj.results = formattedResults
    res.status(200).send(resultObj)
  })
  .catch((err) => console.log('Error:', err))
}


exports.getMetaData = function (req, res) {

  let product_id = req.query.product_id;

  if (!product_id) {
    res.send(500, 'Invalid product ID')
  }

  Review.find({product_id: product_id})
  .then((result) => {

    let output = {
        product_id: product_id,
        ratings: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0
        },
        recommended: {
            false: 0,
            true: 0
        },
        characteristics: {}
    }

    let reviewCount = result.length;
    let cResult = {}

    for (let i = 0; i < result.length; i++) {
      let currentReview = result[i];
      output.ratings[currentReview.rating]++;
      output.recommended[currentReview.recommend]++;

      for (let j = 0; j < currentReview.characteristic_reviews.length; j++) {
        let currentChar = currentReview.characteristic_reviews[j];
        if  (!cResult[currentChar.characteristic_name]) {
          cResult[currentChar.characteristic_name] =  {
            id: currentChar.characteristic_id,
            value: currentChar.value
          }
        } else {
          cResult[currentChar.characteristic_name].value = cResult[currentChar.characteristic_name].value + currentChar.value

        }
      }
    }

    for (var key in cResult) {
      cResult[key].value = cResult[key].value / reviewCount;
    }
    output.characteristics = cResult

    res.send(200, output)

  })
  .catch((err) => console.log('Error:', (err)))

}

exports.addReview = function (req, res) {

  let date = new Date();
  let dateFormat = date.toISOString().slice(0, 10);


  Review.create({
    product_id: req.body.product_id,
    rating: req.body.rating,
    recommend: req.body.recommend,
    reported: false,
    summary: req.body.summary,
    body: req.body.body,
    date: dateFormat,
    reviewer_name: req.body.name,
    helpfulness: 0,
    photos: req.body.photos,
    characteristic_reviews: req.body.characteristics
  }
  )
  .then(() => res.status(200).send('New review submitted'))
  .catch((err) => console.log('Review could not be submitted', err))
}

exports.helpful = function (req, res) {
  let filter = {_id: req.params.review_id};
  let update = {$inc: {
    helpfulness: 1
  }}

  Review.findOneAndUpdate(filter, update)
  .then(() => res.status(200).send('Updated successfully'))
  .catch((err) => console.log('Could not update helpfulness', err))
}


exports.report = function (req, res) {
  let filter = {_id: req.params.review_id};
  let update = {reported: true}


  Review.findOneAndUpdate(filter, update)
  .then(() => res.status(200).send('Updated successfully'))
  .catch((err) => console.log('Could not report review', err))
}