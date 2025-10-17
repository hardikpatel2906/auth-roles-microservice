const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role }
        next();
    } catch (err) {
        console.log(err);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

// const authorizeRoles = (...roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.user.role)) {
//             return res.status(403).json({ message: 'Forbidden: You do not have permission' });
//         }
//         next();
//     };
// };


const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        try {
            // Ensure the user object exists
            if (!req.user || !req.user.role) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized: No user role found.'
                });
            }

            // Check if user's role is allowed
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: 'Forbidden: You do not have permission to access this resource.'
                });
            }

            // Pass control to next middleware/route handler
            next();
        } catch (error) {
            console.error('Authorization error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error during authorization.'
            });
        }
    };
};



module.exports = { authenticate, authorizeRoles };