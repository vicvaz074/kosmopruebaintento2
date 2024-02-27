// authMiddleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    console.log("Token no proporcionado en la solicitud.");
    return res.status(403).send({ error: "Acceso denegado. No se proporcionó token." });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded;
    console.log("Token verificado con éxito:", decoded);
    next();
  } catch (error) {
    console.log("Error al verificar el token:", error.message);
    return res.status(401).send({ error: "Token inválido." });
  }
};

module.exports = verifyToken;


