const { User } = require('../models');
const jwt = require("jsonwebtoken");
const redisClient = require("../config/redisClient");

// REGISTER USER
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if user/email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Create the user
        const newUser = await User.create({
            username,
            email,
            password,
            role // optional - defaults to 'user'
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// LOGIN USER
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const payload = { id: user.id, username: user.username, role: user.role };

        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '15m'
        });

        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '7d'
        });

        //Save Refresh token in redis server
        await redisClient.set(user.id.toString(), refreshToken, {
            EX: 7 * 24 * 60 * 60 // expires in 7 days (in seconds)
        });

        res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// LOGOUT USER
exports.logout = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        await redisClient.del(decoded.id.toString()); // Remove from Redis

        res.status(200).json({
            success: true,
            message: 'Logged out successfully.'
        });
    } catch (error) {
        console.error('Logout error:', error.message);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Refresh token expired.'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Logout failed. Please try again.'
        });
    }
};


exports.refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ success: false, message: 'Refresh token is required.' });
    }

    try {
        // Verify refresh token validity
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Check if refresh token still exists in Redis
        const storedToken = await redisClient.get(`refreshToken:${decoded.id}`);
        if (!storedToken || storedToken !== refreshToken) {
            return res.status(403).json({ success: false, message: 'Invalid or expired refresh token.' });
        }

        // Fetch user from DB
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Generate new access token
        const newAccessToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '15m' } // short-lived access token
        );

        return res.status(200).json({
            success: true,
            message: 'Access token refreshed successfully.',
            accessToken: newAccessToken
        });
    } catch (error) {
        console.error('Token refresh error:', error.message);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Refresh token expired.' });
        }

        return res.status(500).json({ success: false, message: 'Failed to refresh access token.' });
    }
};