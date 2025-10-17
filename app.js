const express = require('express');
const app = express();
require('dotenv').config();
const { User } = require('./models');
const authRoutes = require('./routes/authRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const adminRoutes = require('./routes/adminRoutes');


// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); //Auth Routes
app.use('/api/token', tokenRoutes); //Token Routes
app.use('/api/protected', protectedRoutes);
app.use('/api/admin', adminRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
