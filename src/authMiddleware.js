const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    // En lugar de intentar redirigir, envía un estado 401 no autorizado.
    // Esto permite que el cliente decida qué hacer cuando el token no está presente.
    return res.status(401).json({ message: "Acceso denegado. No hay token proporcionado." });
  }

  jwt.verify(token, 'tu_secreto', (err, user) => {
    if (err) {
      // Enviar un estado 403 prohibido si el token es inválido.
      return res.status(403).json({ message: "Token no válido o expirado." });
    }

    // Si el token es verificado correctamente, adjuntar el usuario al objeto de solicitud.
    req.user = user;
    next(); // Pasar al siguiente middleware o ruta.
  });
};

module.exports = verifyToken;
