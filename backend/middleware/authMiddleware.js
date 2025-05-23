const { verifyToken } = require('../utils/jwtUtils');

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Niste autorizirani' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        
        req.user = {
            id: decoded.id
        };
        next();
    } catch (err) {
        res.status(401).json({ error: 'Nevažeći token' });
    }
};