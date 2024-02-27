const express = require('express');
const router = express.Router();
const AuthController = require('./AuthController');
const verifyToken = require('./authMiddleware');

// Ruta de registro
router.post('/register', AuthController.register);

// Ruta de login
router.post('/login', AuthController.login);

// Ruta para verificar el token de autenticación
router.get('/verify-token', verifyToken, (req, res) => {
  // Si el middleware `verifyToken` pasa, entonces el token es válido
  // Puedes agregar cualquier lógica adicional aquí si es necesario
  // Por ejemplo, devolver información del usuario, etc.
  res.status(200).send({ message: "Token verificado con éxito", isAuthenticated: true });
});

module.exports = router;
