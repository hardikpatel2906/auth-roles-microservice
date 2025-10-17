const express = require('express');
const router = express.Router();
const { refreshToken } = require('../controllers/tokenController');

router.post('/refresh-token', refreshToken);

module.exports = router;
