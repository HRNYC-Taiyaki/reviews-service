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



