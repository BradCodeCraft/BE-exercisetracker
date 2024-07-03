const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
let localStorage = [];
let localLogStorage = []
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// API for /api/users
/**
 * Generate 24 characters for id
 * @returns number
 */
function idGenerator() {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz"
  let id = "";

  for (let i = 0; i < 24; i++) {
    id += chars.charAt(Math.round(Math.random() * chars.length));
  }
  return id;
}

app.get('/api/users', function (req, res) {
  res.send(localStorage)
})

app.post('/api/users', function (req, res) {
  const userID = idGenerator();
  const userObj = {
    "username": req.body.username,
    "_id": userID
  }
  localStorage.push(userObj)
  localLogStorage.push({
    "username": req.body.username,
    "_id": userID,
    "log": []
  })
  res.send(userObj);
})

// API for /api/users/:_id/exercises
/**
 * Find user by id
 * @param {*number} inputID 
 * @returns a user object
 */
function findUserObjByID(inputID, array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i]._id === inputID) {
      return array[i]
    }
  }
}
/**
 * Update the localLogStorage with exerciseObject
 * @param {*string} inputID 
 * @param {*exerciseObject} logObj 
 */
function updateUserLog(inputID, logObj) {
  for (let i = 0; i < localLogStorage.length; i++) {
    if (localLogStorage[i]._id === inputID) {
      localLogStorage[i].log.push({
        "description": logObj.description,
        "duration": logObj.duration,
        "date": new Date(Date.parse(logObj.date)).toDateString(),
      })
    }
  }
}

app.post('/api/users/:_id/exercises', function (req, res) {
  let matchedUserObj = findUserObjByID(req.params._id, localStorage);
  const exercise = {
    "description": req.body.description,
    "duration": Number.parseInt(req.body.duration),
    "date": req.body.date?.length === 0 ? new Date().toDateString() : new Date(Date.parse(req.body.date)).toDateString()
  }
  matchedUserObj = {
    ...matchedUserObj,
    "description": exercise.description,
    "duration": exercise.duration,
    "date": exercise.date
  }
  updateUserLog(req.params._id, exercise)
  res.send(matchedUserObj);
})

// API for /api/users/:_id/logs
app.get('/api/users/:_id/logs?', function (req, res) {
  let matchedUserObj = findUserObjByID(req.params._id, localLogStorage)
  let resultUserObj = {
    "username": matchedUserObj?.username,
    "count": typeof matchedUserObj.log === "undefine" ? 0 : matchedUserObj.log.length,
    "_id": req.params._id,
    "log": matchedUserObj.log
  }
  res.send(resultUserObj);
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
