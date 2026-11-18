
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const musicRoutes = require('./routes/music.routes');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'https://spotify-project-frontend.vercel.app/login',
    credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);

module.exports = app;
