# Atelier API - Reviews Microservice

## About

This project consists primarily of a RESTful API to serve up Review data for an e-commerce website, along with configuration files to setup a corresponding database and populate that database with pre-existing data.

## Built With:

   * [Node.js](https://nodejs.org/en/)
   * [Express](https://expressjs.com)
   * [MongoDB](https://www.mongodb.com/)
   * [Mongoose](https://mongoosejs.com/)
   * [Docker](https://www.docker.com/)
   

## ETL

One of the primary challenges I faced in this project was taking the 4 CSV files of data I was given, which each contained millions of entries, and finding how to transform it in a way that would work well with the API I was developing. The CSVs I received were formatted in the following ways:

```
reviews.csv
├── id 
├── product_id
├── rating
├── date
├── summary
├── body
├── recommend
├── reported
├── reviewer_name
├── reviewer_email
├── response
└── helpfulness

reviews_photos.csv
├── id
├── review_id
└── url

characteristic_reviews.csv
├── id 
├── characteristic_id
├── review_id
└── value

characteristics.csv
├── id 
├── product_id
└── name
```

The original format of that data was more oritented towards a SQL database, with separate tables using foreign keys to reference data in other tables. Looking at the way this data was actually used on the front-end, however, all reviews for a given product needed to be accessable to calculate meta-data on that product's page and the format of the data that the front-end was expecting was very similar to what I imagined a noSQL schema to look like for the data given. For this reason, I decided to use a noSQL database, MongoDB specifically, and to put the data through a somewhat extensive transformation process.

Because of the sheer size of the data (with each CSV having millions of entries), I imported the CSVs in their original state into MongoDB and utilized the Mongo Aggregation Pipeline to transform the data from there. Some of the commands for the transformation process can be found in the [dataTransformation folder](https://github.com/HRNYC-Taiyaki/reviews-service/blob/main/dataTransformation/mongoAggregation.js). The final shape of each "review" can be seen below, with an index created for the "product_id" key so each product's reviews could all be gathered quickly and efficiently.

```
review
├── id 
├── product_id
├── rating
├── date
├── summary
├── body
├── recommend
├── reported
├── reviewer_name
├── reviewer_email
├── response
├── helpfulness
├── [photos]
    ├── id
    └── url
└── [characteristic_reviews]
    ├── id
    ├── name
    └── value
```

 

## API Routes

### List Reviews

**GET /reviews/** 

Returns a list of reviews for a particular product. This list does not include any reported reviews.


#### Query Parameters 

| Parameter  | Type  | Description  |  
|---|---|---|
| page  | integer  | Selects the page of results to return. Default 1.  |
| count  | integer  | Specifies how many results per page to return. Default 5.  |
|  sort | text  | Changes the sort order of reviews to be based on either "newest" or "helpful".  |
|  product_id | integer  | Required ID of the product for which reviews should be returned. |

**Response**
```
Status: 200 OK
```

```
{
  "product": "2",
  "page": 0,
  "count": 5,
  "results": [
    {
      "review_id": 5,
      "rating": 3,
      "summary": "I'm enjoying wearing these shades",
      "recommend": false,
      "response": null,
      "body": "Comfortable and practical.",
      "date": "2019-04-14T00:00:00.000Z",
      "reviewer_name": "shortandsweeet",
      "helpfulness": 5,
      "photos": [{
          "id": 1,
          "url": "urlplaceholder/review_5_photo_number_1.jpg"
        },
        {
          "id": 2,
          "url": "urlplaceholder/review_5_photo_number_2.jpg"
        },
        // ...
      ]
    },
    {
      "review_id": 3,
      "rating": 4,
      "summary": "I am liking these glasses",
      "recommend": false,
      "response": "Glad you're enjoying the product!",
      "body": "They are very dark. But that's good because I'm in very sunny spots",
      "date": "2019-06-23T00:00:00.000Z",
      "reviewer_name": "bigbrotherbenjamin",
      "helpfulness": 5,
      "photos": [],
    },
    // ...
  ]
  ```


### Get Review Metadata

**GET /reviews/meta**

Returns review metadata for a given product.

#### Query Parameters

| Parameter  | Type  | Description  |  
|---|---|---|
| product_id  | integer  | Required ID of the product for which data should be returned  |

**Response**

```
Status: 200 OK
```

```
{
  "product_id": "2",
  "ratings": {
    2: 1,
    3: 1,
    4: 2,
    // ...
  },
  "recommended": {
    0: 5
    // ...
  },
  "characteristics": {
    "Size": {
      "id": 14,
      "value": "4.0000"
    },
    "Width": {
      "id": 15,
      "value": "3.5000"
    },
    "Comfort": {
      "id": 16,
      "value": "4.0000"
    },
    // ...
}
```


### Add a Review

**POST /reviews**

Adds a review for the given product.

#### Body Parameters

| Parameter  | Type  | Description  |  
|---|---|---|
| product_id  | integer  | Required ID of the product to post the review for  |
| rating  | integer  | Integer indicating the review rating  |
| summary  | string  | Summary text of the review |
| body  | string  | Continued or full text of the review |
| recommend  | boolean | 	Value indicating if the reviewer recommends the product |
| name  | string | 	Username for reviewer |
| email | string | 	Email address for reviewer |
| photos | [text] | 	Array of text urls that link to images |
| characteristics | object | 	Object of keys representing characteristic_id and values representing the review value for that characteristic |

**Response**

```
Status: 201 CREATED
```

### Mark Review as Helpful

**PUT /reviews/:review_id/helpful**

Updates a review to show it was found helpful.

#### Parameters

| Parameter  | Type  | Description  |  
|---|---|---|
| review_id | integer  | Required ID of the review to update |

**Response**

```
Status: 204 NO CONTENT
```

### Report Review

**PUT /reviews/:review_id/report**

Updates a review to show it was reported.
Note, this action does not delete the review, but the review will not be returned in the above GET request.



#### Parameters

| Parameter  | Type  | Description  |  
|---|---|---|
| review_id | integer  | Required ID of the review to update |

**Response**

```
Status: 204 NO CONTENT
```

