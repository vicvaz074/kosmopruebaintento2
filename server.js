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

const app = express();

// Configuración de CORS para aceptar peticiones de tu frontend
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? "https://kosmoprueba-09bb3b275582.herokuapp.com/" // URL de tu frontend en producción
    : "http://localhost:3000", // URL de tu frontend en desarrollo
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Importar rutas de autenticación
app.use(authRoutes);

// Rutas protegidas como ejemplo
app.get('/tryme', authMiddleware, (req, res) => {
  res.send('Dashboard Accesible');
});

app.get('/store', authMiddleware, (req, res) => {
  res.send('Store content is protected');
});

// Si estás en producción, sirve los archivos estáticos de la carpeta build de React
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor ejecutándose en el puerto ${PORT}`));
