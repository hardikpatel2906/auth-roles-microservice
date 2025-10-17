const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/admin', authenticate, authorizeRoles('admin'), (req, res) => {
    res.json({ message: 'Welcome Admin! You have full access.' });
});

router.get('/editor', authenticate, authorizeRoles('editor', 'admin'), (req, res) => {
    res.json({ message: 'Welcome Editor or Admin!' });
});

router.get('/user', authenticate, (req, res) => {
    res.json({ message: `Welcome ${req.user.role}` });
});

module.exports = router;