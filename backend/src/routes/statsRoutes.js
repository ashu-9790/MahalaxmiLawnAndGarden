const express = require('express');
const router = express.Router();
const { recordVisit, getStats } = require('../controllers/statsController');
const { protect } = require('../middleware/auth');

router.post('/visit', recordVisit);
router.get('/', protect, getStats);

module.exports = router;
