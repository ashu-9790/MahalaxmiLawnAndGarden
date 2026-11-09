const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables reliably from backend/.env or root
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const statsRoutes = require('./routes/statsRoutes');

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: true, // Dynamically allows the requesting origin (Vercel, localhost, custom domain)
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/stats', statsRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Mahalaxmi Lawn and Garden API is running...' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
