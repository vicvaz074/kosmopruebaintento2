// authMiddleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrae el token del encabezado

  if (!token) return res.status(401).json({ error: 'Acceso denegado. No se proporcionó token.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token no válido' });

    req.user = decoded; // Opcional: asigna la información decodificada a req.user
    next(); // Continúa con la siguiente función en la cadena de middleware
  });
};

module.exports = verifyToken;
