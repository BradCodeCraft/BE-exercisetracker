const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI)

// Schemas
const User = new mongoose.Schema({
  "username": String,
  "_id": String,
})
const Exercise = new mongoose.Schema({
  "username": String,
  "description": String,
  "duration": Number,
  "date": String,
  "_id": String
})
const Log = new mongoose.Schema({
  "username": String,
  "count": Number,
  "_id": String,
  "log": [{
    "description": String,
    "duration": Number,
    "date": String,
  }]
})

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})