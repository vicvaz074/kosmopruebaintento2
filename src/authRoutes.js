const express = require('express');
const router = express.Router();
const { register, login } = require('./AuthController'); // Asegúrate de que la ruta sea correcta

router.post('/registrarse', register);
router.post('/login', login);

module.exports = router;
