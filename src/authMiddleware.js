
const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : false;

  if (!token) {
    // Redireccionar al cliente a la página de inicio.
    // Esto solo funcionará correctamente para solicitudes GET desde un navegador.
    return res.redirect('/');
  }
  
  try {
    const decoded = jwt.verify(token, 'tu_secreto');
    req.user = decoded;
  } catch (error) {
    // Enviar un estado de error y un mensaje indicando que el token no es válido.
    // Para las APIs, es mejor enviar un estado HTTP en lugar de redirigir.
    // En el catch del middleware, donde el token no es válido
    return res.status(401).json({ error: "Token no válido", isAuthenticated: false });

  }

  return next();
};

module.exports = verifyToken;
