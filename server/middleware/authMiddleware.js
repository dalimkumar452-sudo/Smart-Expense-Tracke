const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // হেডার থেকে টোকেন নেওয়া
    const token = req.header('Authorization');
    
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Bearer টোকেন থেকে আসল টোকেন আলাদা করা
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};