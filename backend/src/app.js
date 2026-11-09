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

// Health check & ping endpoints
app.get('/', (req, res) => {
  res.json({ message: 'Mahalaxmi Lawn and Garden API is running...' });
});

app.get('/api/ping', (req, res) => {
  res.status(200).json({ status: 'active', timestamp: new Date().toISOString() });
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

  // Automated Keep-Alive self-ping (every 30 minutes)
  const renderUrl = process.env.RENDER_EXTERNAL_URL || (process.env.NODE_ENV === 'production' ? 'https://mahalaxmilawnandgarden.onrender.com' : null);
  if (renderUrl) {
    const https = require('https');
    console.log(`[Keep-Alive] Scheduled keep-alive ping for ${renderUrl} every 30 minutes.`);
    setInterval(() => {
      https.get(`${renderUrl}/api/ping`, (res) => {
        console.log(`[Keep-Alive] Pinged ${renderUrl}/api/ping - Status: ${res.statusCode}`);
      }).on('error', (err) => {
        console.error('[Keep-Alive] Ping error:', err.message);
      });
    }, 30 * 60 * 1000); // Every 30 minutes
  }
});
