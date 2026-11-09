const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Ensure .env is loaded reliably regardless of current working directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('ERROR: MONGODB_URI is not defined in your environment or .env file!');
    console.error('Resolved path was:', path.resolve(__dirname, '../../.env'));
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    console.error(`Please verify:`);
    console.error(`1. Network connection to MongoDB Atlas.`);
    console.error(`2. Network Access in MongoDB Atlas allows your IP (or 0.0.0.0/0).`);
    console.error(`3. Database username and password in .env are correct.`);
  }
};

module.exports = connectDB;
