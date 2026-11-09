const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
} = require('../controllers/inquiryController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(createInquiry)
  .get(protect, getInquiries);

router.route('/:id')
  .patch(protect, updateInquiryStatus)
  .delete(protect, deleteInquiry);

module.exports = router;
