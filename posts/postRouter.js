const express = require('express');
const router = express.Router();
const PostDb = require("./postDb");

router.get('/',  (req, res) => {
  PostDb.get()
  .then(posts => {
    if(!posts.length){
     res.status(404).json({ message: "No posts found."})
    }
     res.status(200).json(posts)
  })
  .catch((error) => {
    res.status(500).json({errorMessage: "oops! something went wrong."})
  })
});

router.get('/:id', validatePostId(), (req, res) => {
    res.status(200).json(req.post)
});

router.delete('/:id', validatePostId(), (req, res) => {
  PostDb.remove(req.params.id)
  .then(post => {
    res.status(200).json(post)
  })
  .catch(error => {
    res.status(500).json({errorMessage: "oopsie! something went wrong"})
  })
});

router.put('/:id', validatePostId(), (req, res) => {
   const updatedPost = {...req.body, text: req.body.text}
   if(!req.body || !req.body.text){
     res.status(400).json({message: "Text field or body is missing"})
   }
   PostDb.update(req.params.id, updatedPost)
   .then(post => {
     res.status(201).json({message: "your post is updated."})
   })
   .catch(error => {
    res.status(500).json({errorMessage: "oopsie! something went wrong"})
   })
});

// custom middleware

function validatePostId() {
  return(req, res, next) => {
    PostDb.getById(req.params.id)
    .then(post => {
      if(!post){
        res.status(404).json({message: "post with the postId is not found."})
      } else {
        req.post = post
        next()
      }
    })
      .catch(error => {
        next({message: "oops somethging was wrong"})
      })
  }
}

module.exports = router;
