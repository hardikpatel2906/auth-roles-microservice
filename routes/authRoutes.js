const express = require('express');
const router = express.Router();
const { registerUser, login, logout, refreshAccessToken } = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', registerUser);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refreshAccessToken);


module.exports = router;