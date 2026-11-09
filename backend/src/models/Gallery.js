const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    enum: ['transformation', 'single'],
    default: 'transformation'
  },
  beforeImageUrl: {
    type: String
  },
  beforeCloudinaryId: {
    type: String
  },
  afterImageUrl: {
    type: String,
    required: true
  },
  afterCloudinaryId: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['lawn', 'tree', 'garden', 'other'],
    default: 'other'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Gallery', gallerySchema);
