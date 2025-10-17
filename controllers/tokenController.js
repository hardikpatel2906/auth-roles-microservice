const jwt = require('jsonwebtoken');
const redisClient = require('../config/redisClient');

const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(401).json({ message: 'Missing token' });

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Get stored token from Redis
        const storedToken = await redisClient.get(decoded.id.toString());

        if (storedToken !== refreshToken) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        // Create new access token
        const newAccessToken = jwt.sign(
            { id: decoded.id, username: decoded.username, role: decoded.role },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        console.error('Token Refresh Error:', err);
        return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};

module.exports = { refreshToken };
