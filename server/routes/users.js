var express = require('express');
var router = express.Router();

const user = {
  email: "fake.user@uber.com",
  firstName: "Allan",
  id: '12345',
  lastName: "Bogh"
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json([user]);
});

router.get('/loggedInUser', function(req, res, next) {
  //res.send('respond with a resource');
  res.json(user);
});

router.get('/:id', function(req, res, next) {
  res.json(user);
});

module.exports = router;
