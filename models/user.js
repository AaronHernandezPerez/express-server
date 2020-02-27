const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  registerDate: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['user', 'admin'],
    required: true
  }
});


module.exports = mongoose.model('User', UserSchema);