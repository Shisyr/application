const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  var username = "";
  var email = "";
  if(req.cookies['user'])
  {
    username = req.cookies['user']['username'];
    email = req.cookies['user']['email'];
  }
  var result = [email, username];
  res.render('index', {result : result, });
})

module.exports = router
