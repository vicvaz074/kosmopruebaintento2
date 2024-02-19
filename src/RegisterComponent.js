import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterComponent.css';
import { DarkModeContext } from './DarkModeContext';
import registerBasicBot from './assets/img/KOSMO_BOT_BASICO.svg';
import registerUserIcon from './assets/img/LOGO_USER_ICONE.svg';
import registerPasswordIcon from './assets/img/CANDADO.svg';
import eyeIcon from './assets/img/eye_icon.svg';
import AlertComponent from './AlertComponent';

const RegisterComponent = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      return setError("La contraseña debe tener al menos 6 caracteres");
    }
    if (password !== confirmPassword) {
      return setError("Las contraseñas no coinciden");
    }

    try {
      const response = await fetch('https://kosmoprueba-09bb3b275582.herokuapp.com/registrarse', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        // Registro exitoso, mostrar alerta
        alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
        navigate('/login');
      } else {
        const result = await response.json();
        setError(result.error || "Error en el registro, Usuario o correo ya en uso, intenta de nuevo.");
      }
    } catch (error) {
      setError("Error al conectar con el servidor.");
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div>
      <div className={`register-wrapper ${darkMode ? 'dark-mode' : ''}`}>
        <div className="register-panel-wrapper">
          <div className="register-panel">
            <div className="register-content">
              <h1>REGÍSTRATE EN TU CUENTA</h1>
              <form onSubmit={handleSubmit} className="register-form">
                <div className="input-group">
                  <img src={registerUserIcon} alt="User Icon" className="input-icon" />
                  <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                    placeholder="Nombre de usuario" 
                    className="input-field" 
                    style={{ borderBottom: '2px solid #000' }} // Aumentar el grosor del borde inferior
                  />
                </div>
                <div className="input-group">
                  <img src={registerUserIcon} alt="Email Icon" className="input-icon" />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    placeholder="Correo electrónico" 
                    className="input-field" 
                    style={{ borderBottom: '2px solid #000' }} // Aumentar el grosor del borde inferior
                  />
                </div>
                <div className="input-group">
                  <img src={registerPasswordIcon} alt="Password Icon" className="input-icon" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    placeholder="Contraseña" 
                    className="input-field" 
                    style={{ borderBottom: '2px solid #000' }} // Aumentar el grosor del borde inferior
                  />
                  <button onClick={toggleShowPassword} type="button" className="password-toggle">
                    <img src={eyeIcon} alt="Toggle Password" />
                  </button>
                </div>
                <div className="input-group">
                  <img src={registerPasswordIcon} alt="Confirm Password Icon" className="input-icon" />
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                    placeholder="Confirmar Contraseña" 
                    className="input-field" 
                  />
                  <button onClick={toggleShowConfirmPassword} type="button" className="password-toggle">
                    <img src={eyeIcon} alt="Toggle Confirm Password" />
                  </button>
                </div>
                <button type="submit" className="registerButton">Registrar</button>
                <p className="login-register-link">
                  ¿Ya tienes una cuenta con Kosmo? <span onClick={() => navigate('/login')}>Inicia sesión aquí</span>
                </p>
                <AlertComponent message={error} />
              </form>
            </div>
          </div>
        </div>
        <div className="register-robot-big">
          <img src={registerBasicBot} alt="Kosmo Bot" className="floating-robot" />
        </div>
        <div className="footer">
          <p>© Kosmo. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterComponent;
