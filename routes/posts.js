const express = require('express')
const router = express.Router()
const Post = require('../models/post');
const Joi = require('joi');
const mongoose = require('mongoose');
const User = require('../models/user');
const session = require('express-session');
const postSchema = Joi.object().keys({
  name_post: Joi.string().required(),
  description: Joi.string().required(),
  author_id: Joi.string().required(),
  author_email: Joi.string().required(),
  author_name: Joi.string().required()
})

router.get('/new', async (req, res, next) => {
  res.render('createPost',{ result : req.cookies });
});
router.post('/new', async (req, res, next) => {
  try{
    req.body.author_name = req.cookies['user']['username'];
    req.body.author_email = req.cookies['user']['email'];
    req.body.author_id = req.cookies['user']['_id'];
    const result = Joi.validate(req.body, postSchema)
    if (result.error) {
      req.flash('error', 'Data entered is not valid. Please try again.')
      res.redirect('/posts/new')
      return
    }
    const newPost = await new Post(result.value);
    await newPost.save()
    Post.find({}, function(err, docs){
      if(err) return console.log(err);
        res.render('posts', {posts : docs, result : req.cookies });
    });

  } catch(error) {
    next(error)
  }
});

router.get('/index', (req, res) => {
  console.log(req.session.user_id);
  console.log(req.session.authorized);
  console.log(req.session.messages);
  Post.find({}, function(err, docs){
    if(err) return console.log(err);
      res.render('posts', {posts : docs, result : req.cookies });
  });
});



module.exports = router
