const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  userAgent: {
    type: String,
    required: false
  },
  ip: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Visit', visitSchema);
