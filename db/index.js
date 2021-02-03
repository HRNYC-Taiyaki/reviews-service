var mongoose = require("mongoose");
var mongoUri = "mongodb://localhost:27017/sdc"
mongoose.Promise = Promise;

// Connect Mongoose to our local MongoDB via URI specified above
mongoose.connect(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true });

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => { console.log('Connected to mongodb!'); });


module.exports = db;
