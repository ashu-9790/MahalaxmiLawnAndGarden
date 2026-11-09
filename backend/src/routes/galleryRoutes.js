const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const { upload, cloudinary } = require('../middleware/upload');
const auth = require('../middleware/auth');

// @route   GET /api/gallery
// @desc    Get all gallery images
// @access  Public
router.get('/', async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/gallery
// @desc    Upload before and after images
// @access  Private (Admin only)
router.post('/', auth.protect, upload.fields([{ name: 'beforeImage', maxCount: 1 }, { name: 'afterImage', maxCount: 1 }]), async (req, res) => {
  try {
    const uploadType = req.body.type || 'transformation';

    if (uploadType === 'transformation') {
      const count = await Gallery.countDocuments({ type: 'transformation' });
      if (count >= 5) {
        return res.status(400).json({ msg: 'Limit of 5 Before & After transformations reached.' });
      }
      
      if (!req.files || !req.files['beforeImage'] || !req.files['afterImage']) {
        return res.status(400).json({ msg: 'Both before and after images are required for transformations' });
      }

      const newGalleryItem = new Gallery({
        title: req.body.title,
        type: 'transformation',
        beforeImageUrl: req.files['beforeImage'][0].path,
        beforeCloudinaryId: req.files['beforeImage'][0].filename,
        afterImageUrl: req.files['afterImage'][0].path,
        afterCloudinaryId: req.files['afterImage'][0].filename,
        category: req.body.category || 'other'
      });
      const savedImage = await newGalleryItem.save();
      return res.json(savedImage);

    } else if (uploadType === 'single') {
      const count = await Gallery.countDocuments({ type: 'single' });
      if (count >= 30) {
        return res.status(400).json({ msg: 'Limit of 30 single photos reached.' });
      }

      if (!req.files || !req.files['afterImage']) {
        return res.status(400).json({ msg: 'Image file is required' });
      }

      const newGalleryItem = new Gallery({
        title: req.body.title,
        type: 'single',
        afterImageUrl: req.files['afterImage'][0].path,
        afterCloudinaryId: req.files['afterImage'][0].filename,
        category: req.body.category || 'other'
      });
      const savedImage = await newGalleryItem.save();
      return res.json(savedImage);
    }

  } catch (err) {
    console.error('Upload Error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/gallery/:id
// @desc    Delete an image
// @access  Private (Admin only)
router.delete('/:id', auth.protect, async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ msg: 'Image not found' });
    }

    // Delete images from cloudinary
    if (image.beforeCloudinaryId) {
      await cloudinary.uploader.destroy(image.beforeCloudinaryId);
    }
    await cloudinary.uploader.destroy(image.afterCloudinaryId);

    // Delete from database
    await image.deleteOne();

    res.json({ msg: 'Image removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Image not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
