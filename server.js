const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();
const User = require('./src/user.js');
const path = require('path');
const authMiddleware = require('./src/authMiddleware.js');
const authRoutes = require('./src/authRoutes.js');

console.log('Iniciando servidor...');

const app = express();

// Configuración de CORS para aceptar peticiones de tu frontend
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? "http://localhost:3000" // URL de tu frontend en producción
    : "http://localhost:3000", // URL de tu frontend en desarrollo
  optionsSuccessStatus: 200
};

console.log(`Configurando CORS para el entorno: ${process.env.NODE_ENV}`);

app.use(cors(corsOptions));

app.use(express.json());

console.log('Conectando a MongoDB...');

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('Error al conectar con MongoDB:', err));

console.log('Importando rutas de autenticación...');

// Importar rutas de autenticación
app.use(authRoutes);

console.log('Configurando rutas protegidas...');

// Rutas protegidas como ejemplo
app.get('/tryme', authMiddleware, (req, res) => {
  console.log('Acceso a /tryme');
  res.send('Dashboard Accesible');
});

app.get('/store', authMiddleware, (req, res) => {
  console.log('Acceso a /store');
  res.send('Store content is protected');
});

// Si estás en producción, sirve los archivos estáticos de la carpeta build de React
if (process.env.NODE_ENV === 'production') {
  console.log('Entorno de producción detectado. Sirviendo archivos estáticos...');

  app.use(express.static(path.join(__dirname, 'build')));

  app.get('*', (req, res) => {
    console.log('Solicitud a la ruta base en producción.');
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor ejecutándose en el puerto ${PORT}`));
