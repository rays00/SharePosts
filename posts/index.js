const express = require('express')
const mongoose = require('mongoose')
const Post = require('./models/Post')
const User = require('./models/User')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const jwtSecret = require('./config/keys').JWT_KEY
const dbUri = require('./config/keys').DB_URI
const app = express()
const port = 3001

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected"))
  .catch(err => console.log(err))

app.use(bodyParser.json());

app.get('/', (req, res) => {
  Post.find()
  .populate( {path: 'userId', model: User, select: 'name'})
  .then(posts => res.json(posts))
})

app.post('/', (req, res) => {
  try {
    jwt.verify(req.headers.authorization.split(" ")[1], jwtSecret);
    decoded = jwt.decode(req.headers.authorization.split(" ")[1], jwtSecret);
    savePost(res, decoded.userId, req.body.title, req.body.description)
  } catch (err) {
    res.status(401).json({"error":"Unauthorized"})
  }
})

app.put('/:id', (req, res) => {
  try {
    jwt.verify(req.headers.authorization.split(" ")[1], jwtSecret);
    Post.findById(req.params.id)
    .exec()
    .then(post => {
      post.title = req.body.title
      post.description = req.body.description
      post.save()
      .then(product => res.status(200).json({ message: "Success!", post: post }))
      .catch(err => res.status(500).json({ error: err }))
    })
    .catch (err => res.status(500).json({ message: 'We couldn\'t find this post.'}))
  } catch (err) {
    res.status(401).json({"error":"Unauthorized"})
  }
})

app.delete('/:id', (req, res) => {
  try {
    jwt.verify(req.headers.authorization.split(" ")[1], jwtSecret);
    Post.findById(req.params.id)
    .exec()
    .then(post => {
      post.delete()
      .then(product => res.status(200).json({ message: "Success!" }))
      .catch(err => res.status(500).json({ error: err }))
    })
    .catch (err => res.status(500).json({ message: 'We couldn\'t find this post.'}))
  } catch (err) {
    res.status(401).json({"error":"Unauthorized"})
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function savePost(res, userId, title, description) {
  let newPost = new Post({
    userId: userId,
    title: title,
    description: description
  });
  newPost.save()
    .then(post => {
        res.status(200).json({ message: "Success!", post: post })
      })
    .catch(err => res.status(500).json({ error: err }));
}