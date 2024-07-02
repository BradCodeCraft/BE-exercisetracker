const express = require('express')
const app = express()
const cors = require('cors')
const bodyParse = require('body-parse');
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(bodyParse.urlencoded({ extended: true }))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
