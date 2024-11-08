const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).send('Acceso denegado. No se proporcionó un token.');
    }

    try {
        const decoded = jwt.verify(token, 'banbifBDTok$nPa$%');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send('Token no válido.');
    }
};

module.exports = authMiddleware;
