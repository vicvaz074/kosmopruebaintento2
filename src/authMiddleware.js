// authMiddleware.js

const jwt = require('jsonwebtoken');
const SECRET_KEY = 'tu_secreto'; // Asegúrate de reemplazar 'tu_secreto' con tu clave secreta real

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    jwt.verify(bearerToken, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Token no válido' });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res.status(401).json({ error: 'Acceso denegado. No se proporcionó token.' });
  }
};

module.exports = verifyToken;

