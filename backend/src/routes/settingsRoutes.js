const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { protect } = require('../middleware/auth');

// GET settings (public)
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.find();
    // Convert array of {key, value} to a single object {key: value}
    const settingsObj = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(settingsObj);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT update a specific setting (admin only)
router.put('/:key', protect, async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    const setting = await Settings.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true } // upsert creates it if it doesn't exist
    );

    res.json(setting);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
