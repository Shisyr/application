const express = require('express');
const router = express.Router()
const Joi = require('joi')
const passport = require('passport')
const session = require('express-session');
const User = require('../models/user')

//validation schema

const userSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required(),
  confirmationPassword: Joi.any().valid(Joi.ref('password')).required()
})

router.route('/register')
  .get((req, res) => {
    res.render('register')
  })
  .post(async (req, res, next) => {
    try {
      const result = Joi.validate(req.body, userSchema)
      if (result.error) {
        req.flash('error', 'Data entered is not valid. Please try again.')
        res.redirect('/users/register')
        return
      }
      const user = await User.findOne({ 'email': result.value.email })
      if (user) {
        req.flash('error', 'Email is already in use.')
        res.redirect('/users/register')
        return
      }

      const hash = await User.hashPassword(result.value.password)
      delete result.value.confirmationPassword
      result.value.password = hash

      const newUser = await new User(result.value)
      await newUser.save()
      req.flash('success', 'Registration successfully, go ahead and login.');
      res.redirect('/users/login');

    } catch(error) {
      next(error)
    }
  });
  router.route('/login').get((req, res) => {
      console.log(req.isAuthenticated());
      res.render('login', {message : "Неверный пароль!"});
    });

  router.route('/login').post(async (req, res, next) =>{
    try{
      if(req.session.user){
        res.redirect('/login');
      }

      const user = await User.findOne({ 'email': req.body.email});
      const isOkay = await User.compare(user.password, req.body.password);
      console.log(isOkay);
      console.log(req.cookies);
      if(isOkay)
      {
        res.cookie('user', user);
        req.flash('success', 'Authorization successfully, go ahead and look my site.');
        res.render('index', {result : user});
      }
      else{
        res.status(401).render('login', {message : "Неверный пароль!"});
      }
    }
    catch(e)
    {
      res.redirect('/login');
    }
  });
  router.get('/logout', function(req, res) {
		res.cookie('user', null, { maxAge: 0, httpOnly: true });
		return res.redirect('/');
	});

  module.exports = router
