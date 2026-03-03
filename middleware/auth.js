const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token || token == 'null') {
        return res.status(401).json({ success: false, message: 'Not authorize to access this route' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);

        // 1. We look up the user by the ID in the token
        req.user = await User.findById(decoded.id);

        // 2. 🚨 THE FIX: Check if the user was actually found! 🚨
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'The user belonging to this token no longer exists in the database' 
            });
        }

        next();
    } catch (err) {
        console.log(err.stack);
        return res.status(401).json({ success: false, message: 'Not authorize to access this route' });
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        // Now it's safe to check req.user.role because we guaranteed req.user exists above!
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    }
}