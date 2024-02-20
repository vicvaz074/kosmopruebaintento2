const express = require('express');
const router = express.Router();
const { register, login } = require('./AuthController'); // Verifica la ruta
const authMiddleware = require('./path_to_your_authMiddleware'); // Asegúrate de importar correctamente tu middleware de autenticación

// Endpoint para registro
router.post('/registrarse', register);

// Endpoint para inicio de sesión
router.post('/login', login);

// Endpoint para verificar la validez del token
router.get('/verify-token', authMiddleware, (req, res) => {
    // Si el middleware permite llegar hasta aquí, el token es válido
    res.status(200).json({ message: "Token válido", isAuthenticated: true });
});

module.exports = router;
