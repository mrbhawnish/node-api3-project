const express = require('express');
const UserDb = require('./userDb');
const PostDb = require('../posts/postDb');
const router = express.Router();

router.post('/', validateUser(), (req, res) => {
  res.status(201).json(req.user)
});

router.post('/:id/posts', validateUserId(), validatePost(), (req, res) => {
  res.status(201).json(req.post)
});

router.get('/', (req, res) => {
  UserDb.get()
  .then(users => {
    if(!users.length){
      res.status(404).json({ errorMessage: "Not Found!"})
    }
    res.status(200).json(users)
  })
  .catch((error) => {
    res.status(500).json({ errorMessage: "something went wrong, try again later"})
  })
});

router.get('/:id', validateUserId(), (req, res) => {
  res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId(), (req, res) => {
    UserDb.getUserPosts(req.params.id)
    .then(post => {
      if(!post.length) {
        res.status(404).json({message: "oops! no posts found for this user"})
      }
      res.status(200).json(post)
    })
    .catch(error => {
      res.status(500).json({ errorMessage: "oops! something went wrong"})
    })

});
 

router.delete('/:id', validateUserId(), (req, res) => {
  UserDb.remove(req.params.id)
  .then((user) => {
    res.status(200).json({ message: "user deleted successfully!"})
  })
  .catch(error => {
    res.status(500).json({ errorMessage: "oops! something went wrong"})
  })
});

router.put('/:id',  validateUserId(), (req, res) => {
  const updatedUser = {...req.body, name: req.body.name}
  if(!req.body.name){
    res.status(400).json({ message: "Name field is not included"})
  }
  UserDb.update(req.user.id, updatedUser)
  .then(user => {
     res.status(201).json({message: "user_updated"})
  })
  .catch(error => {
    res.status(500).json({errorMessage: "oops! something went wrong updating"})
  })
});

//custom middleware

function validateUserId() {
  return (req, res, next) => {
    UserDb.getById(req.params.id)
    .then(user => {
       if(!user){
         res.status(404).json({message: "userId is not found."})
       } else {
       req.user = user
       next()
       }
    })
     .catch(error => {
       res.status(500).json({
         message: "something went wrong, try again"
       })
     })
 
   }
}

function validateUser() {
    return(req, res, next) => {
    const { name } = req.body;
    const newUser = { name: name, ...req.body }
  try{
      if(!req.body.length || !req.body) {
       res.status(400).json({ errorMessage: "missing user data"})
    } else if(!name){
       res.status(400).json({ errorMessage: "missing the name field!"})
    } else {
      UserDb.insert(newUser)
      .then(user => {
       req.user = user
       next()
      })
      .catch((error) => {
        next({message: "oops somethging was wrong"})
      })
    }
  }catch(error) {
    next({message: "oops somethging was wrong"})
  }
}
}

function validatePost() {
  return (req, res, next) => {
    const newPost = {user_id: req.params.id, ...req.body}
    const { text } = req.body;
    if(!req.body){
      res.status(400).json({message: "missing post data"})
    }
    else if(!text) {
      res.status(400).json({ message: "missing required text field" })
    }
    else {
      PostDb.insert(newPost)
      .then(post => {
       req.post = post
       next()
      })
      .catch(error => {
       next({message: "oops somethging was wrong"})
      })
    }
  }
}

module.exports = router;
