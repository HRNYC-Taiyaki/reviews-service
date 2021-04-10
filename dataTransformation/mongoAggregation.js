
//add characteristic name to relevant characteristic review
db.characteristic_reviews.aggregate([
  {
      $lookup:{
          from: "characteristics",
          localField: "characteristic_id",
          foreignField: "id",
          as: "characteristic_name"
      }
  },
  {   $unwind:"$characteristic_name" },
  {
      $project:{
        _id : 0,
        characteristic_id: 1,
        review_id : 1,
        value: 1,
        characteristic_name : "$characteristic_name.name"
    }
  },
  { $out: "c_reviews"}
])

//add charactersitic_reviews as array to relevent review
db.reviews.aggregate([
	{
	  $lookup: {
	    from: 'c_reviews',
	    localField: 'id',
	    foreignField: 'review_id',
	    as: 'characteristic_reviews'
		}
	},
	{
		$out: 'reviews'
	}
])

//reviews is review with characteristic_reviews array

//add photos as array to relevant review
db.reviews.aggregate([
	{
	  $lookup: {
	    from: 'reviews_photos',
	    localField: 'id',
	    foreignField: 'review_id',
	    as: 'photos'
		}
	},
	{
		$out: 'reviewstest'
	}
])

//reviewx is review with characteristc_reviews array and photos array

//create new collection called product_id with new document for each unique product_id
db.reviews.aggregate([
  {
      $group: {
          _id: null,
          product_id: { $addToSet: "$product_id" }
      }
  },
  {
      $unwind: "$product_id"
  },
  {
      $project: {
          _id: 0,
      }
  },
  { $out: "product_id" }
]);


db.products.aggregate([
	{
	  $lookup: {
	    from: 'testt',
	    localField: 'product_id',
	    foreignField: 'p_id',
	    as: 'reviews'
		}
	},
	{
		$out: 'product_id'
	}
])

db.product_id.aggregate(
  [
    { $sort : { product_id : 1 } },
    {
      $out: 'products'
    }
  ]
)



db.reviewsx.aggregate([
	{
    $addFields: {
      "p_id": "$product_id"
   }
  },
   {
    $out: 'testt'
  }
])


db.product_id.aggregate([
	{
	  $lookup: {
	    from: 'testt',
	    localField: 'product_id',
	    foreignField: 'p_id',
	    as: 'reviews'
		}
	},
	{
		$out: 'output'
	}
])

db.reviewsx.aggregate( [
  {
     $group:
        {
           _id: "$product_id",
           reviews: { $push:  { id: "$id", url: "$url" } }
        }
  },
  //export to new table
  { $out: "photos_by_review"}
],
  {
  allowDiskUse: true
  }
)

db.reviewsx.aggregate([
 { $group: {
  _id: "$product_id",
  "reviews": {
      $push: "$$ROOT"
  },
  }},
  {$out: 'testoutput'}
],{
  allowDiskUse: true
  })

