const express = require('express')
const mongoose = require('mongoose')
const User = require('./models/User')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const saltRounds = 10
const jwt = require('jsonwebtoken')
const jwtSecret = require('./config/keys').JWT_KEY
const dbUri = require('./config/keys').DB_URI
const app = express()
const port = 3000

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected"))
  .catch(err => console.log(err))

app.use(bodyParser.json());

app.post('/', function (req, res) {
  User.findOne({ email: req.body.email })
  .exec()
  .then(user => {
    if (user) {
      return res.status(409).json({ message: 'Email address already exists.' })
    } else {
      let validate = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(req.body.password)
      if (!validate) {
        return res.status(400).json({ message: 'Password should contain at least 8 alphanumeric characters.' })
      }
      saveUser(res, req.body.email, req.body.password, req.body.name);
    }
  })
})

app.post('/login', function (req, res) {
  console.log(User)
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: 'Auth failed' })
      }
      loginUser(req, res, user);
    })
})

function saveUser(res, email, password, name) {
  bcrypt.hash(password, saltRounds, function (err, hash) {
    let newUser = new User({
      email: email,
      password: hash,
      name: name
    });
    newUser.save()
      .then(user => {
        var token = jwt.sign({
          userId: user._id,
          email: user.email,
          name: user.name
        }, jwtSecret, {
          expiresIn: "1h"
        });
        res.status(200).json({ message: "Success!", token: token })
      })
      .catch(err => res.status(500).json({ error: err }));
  })
}

function loginUser(req, res, user) {
  bcrypt.compare(req.body.password, user.password, function (err, result) {
    if (result === false) {
      return res.status(401).json({ message: "Auth failed." });
    }
    // Generate user token
    var token = jwt.sign({
      userId: user._id,
      email: user.email,
      name: user.name,
    }, jwtSecret, {
      expiresIn: "1h"
    });
    return res.status(202).json({
      message: "Success!",
      token: token
    });
  });
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
