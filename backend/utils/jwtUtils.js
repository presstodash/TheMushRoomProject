const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/authMiddleware');
require('dotenv').config();


module.exports = {
    generateToken(userId) {
        return jwt.sign(
            { id: userId},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRATION || '1h'}
        );
    },

    verifyToken(token){
        return jwt.verify(token, process.env.JWT_SECRET);
    }
};