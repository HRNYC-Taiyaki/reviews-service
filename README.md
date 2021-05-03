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

Though the way the data was given to me was formatted Looking at the way this data was used on the front-end, whenever a user visited a product's page, all of that products review data was needed. All reviews needed to be accessable to render and all the review's meta-data was needed to show overall ratings. Thus, it made the most sense to me to organize the data similarly, using a noSQL database with 

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



