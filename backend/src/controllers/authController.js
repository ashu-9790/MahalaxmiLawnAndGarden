const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Automatically seed default admin if the collection is empty
    const adminCount = await Admin.countDocuments({});
    if (adminCount === 0) {
      const defaultUsername = process.env.ADMIN_USERNAME || 'admin';
      const defaultPassword = process.env.ADMIN_PASSWORD || 'mahalaxmi123';
      console.log(`No admin found. Auto-seeding initial admin account: ${defaultUsername}`);
      await Admin.create({
        username: defaultUsername,
        password: defaultPassword,
      });
    }

    const admin = await Admin.findOne({ username });

    if (admin && (await admin.matchPassword(password))) {
      return res.json({
        _id: admin._id,
        username: admin.username,
        token: generateToken(admin._id),
      });
    } else {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = { loginAdmin };
