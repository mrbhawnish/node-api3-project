const express = require('express');
const userRouter = require('./users/userRouter.js');
const postRouter = require('./posts/postRouter')
const server = express();
server.use(express.json());
server.use(logger)

server.use("/users", userRouter)
server.use("/posts", postRouter)
server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  const time = new Date().toTimeString()
  console.log(`${req.method}, ${req.url}, ${time}`)

  next()
}

server.use((error, req, res, next) => {
  res.status(500).json({ message: error })
});

module.exports = server;
