const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();
const app = express();

// Connect DB
connectDB();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS setup
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));

// Static folder for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------- ROUTES ----------
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/blogs', require('./src/routes/blogRoutes'));
// ✅ correct one

// Health check route
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'MERN Blog API running' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
