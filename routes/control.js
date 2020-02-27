const express = require('express');
const jwtMiddleware = require("../middleware/jwtMiddleware");

const User = require('../models/user');

const router = express.Router();


router.get('/', function (req, res) {
  res.send('Control room view');
});

router.post('/login', async function (req, res) {
  try {
    // Promise with await
    const user = await User.findOne({
      username: req.body.username
    });

    // Verify user and password!
    if (!user) {
      return res.status(403).json({ error: `This user doesn't exist.` })
    }

    if (req.body.password !== user.password) {
      return res.status(403).json({ error: `The password is invalid.` });
    }

    // Async login
    jwtMiddleware.getToken(user, (err, token) => {
      res.json({ token });
    })

  } catch (error) {
    res.json({ error });
  }
});

router.post('/register', function (req, res) {
  let user = new User(
    req.body
  );

  const errors = user.validateSync();
  if (errors) {
    return res.json({ error: errors.message })
  }

  // Promise with then
  user.save()
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      res.json({ error });
    });

});
module.exports = router;