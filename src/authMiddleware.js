const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    // Redireccionar al cliente a la página de inicio.
    // Esto solo funcionará correctamente para solicitudes GET desde un navegador.
    return res.redirect('/#inicio');
  }
  
  try {
    const decoded = jwt.verify(token, 'tu_secreto');
    req.user = decoded;
  } catch (error) {
    // Enviar un estado de error y un mensaje indicando que el token no es válido.
    // Para las APIs, es mejor enviar un estado HTTP en lugar de redirigir.
    return res.status(401).send('Token no válido');
  }

  return next();
};

module.exports = verifyToken;
