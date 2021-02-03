const express = require('express');
const app = express()
const port = 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
const database = require('../db/reviewSchema.js')
var controller = require('../db/controller.js')

app.use(cors());
app.use(bodyParser.urlencoded())
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/reviews', controller.getReviews)

app.get('/reviews/meta', controller.getMetaData)

app.post('/reviews', controller.addReview)

app.put('/reviews/:review_id/helpful', controller.helpful)

app.put('/reviews/:review_id/report', controller.report)



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})