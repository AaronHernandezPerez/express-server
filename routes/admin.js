const express = require('express');

const mongoose = require('mongoose');


const User = require('../models/user');

const router = express.Router();
const jwtMiddleware = require('../middleware/jwtMiddleware')

router.use(jwtMiddleware.verifyAdmin);

router.get('/', function (req, res) {
  User.find()
    .then(data => {
      res.json(data)
    }).catch(error => {
      res.json(error)
    })
});

router.delete('/:id', function (req, res) {
  User.deleteOne({ _id: req.params.id })
    .then(data => {
      res.json(data);
    }).catch(error => {
      res.json({ error: error.message });
    })
});

router.get('/:id', function (req, res) {
  User.findOne({ _id: req.params.id })
    .then(data => {
      res.json(data);
    }).catch(error => {
      res.json({ error: error.message });
    })
});

router.patch('/:id', async function (req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true });
    res.json(user);
  } catch (error) {
    res.json({ error: error.message });
  }
});

module.exports = router;