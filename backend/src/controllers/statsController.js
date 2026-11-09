const Visit = require('../models/Visit');

// @desc    Record a new site visit
// @route   POST /api/stats/visit
// @access  Public
const recordVisit = async (req, res) => {
  try {
    const userAgent = req.headers['user-agent'];
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    await Visit.create({
      userAgent,
      ip
    });

    res.status(201).json({ success: true, message: 'Visit recorded' });
  } catch (error) {
    console.error('Error recording visit:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get total and today's visits
// @route   GET /api/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  try {
    const totalVisits = await Visit.countDocuments();

    // Calculate start of today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayVisits = await Visit.countDocuments({
      timestamp: { $gte: startOfToday }
    });

    res.status(200).json({
      success: true,
      data: {
        totalVisits,
        todayVisits
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  recordVisit,
  getStats
};
