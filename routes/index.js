const express = require('express')
const router = express.Router()
const session = require('express-session');
router.get('/', (req, res) => {
  var username = "";
  var email = "";
  var result = [];
  if(req.cookies['user'])
  {
    username = req.cookies['user']['username'];
    email = req.cookies['user']['email'];
  }
  if(username && email)
  {
    result = [email, username];
  }
  else{
    result = undefined;
  }
  console.log(result);
  res.render('index', {result : result});
});


module.exports = router
