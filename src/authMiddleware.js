const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    // Enviar un estado de error y un mensaje indicando que falta el token.
    // Esto permite que el lado del cliente maneje la situación, posiblemente redirigiendo al usuario.
    return res.status(401).send({ error: 'Acceso denegado. No se proporcionó token.' });
  }
  
  try {
    const decoded = jwt.verify(token, 'tu_secreto');
    req.user = decoded;
  } catch (error) {
    // Enviar un estado de error y un mensaje indicando que el token no es válido.
    return res.status(401).send({ error: 'Token no válido' });
  }

  return next();
};

module.exports = verifyToken;

