import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from './DarkModeContext';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import LoginComponent from './LoginComponent';
import RegisterComponent from './RegisterComponent';
import KosmoTryComponent from './KosmoTryComponent';
import './darkmode.css';
import logo from './assets/img/LOGO_AZULOSC.svg';
import kosmoLogo from './assets/img/KOSMO_AZUL.svg';
import kosmoOxxo from './assets/img/KOSMO_OXXO.svg';
import kosmoBasic from './assets/img/KOSMO_BASICO.svg';
import kosmoConstructor from './assets/img/KOSMO_CONSTRUCTOR.svg';
import earth from './assets/img/PLANETA.png';
import ship from './assets/img/NAVE.png';
import aboutVideo from './assets/videos/NOSOTROS.mp4';
import Carousel from 'react-bootstrap/Carousel';
import kosmoBotBasico from './assets/img/KOSMO_BOT_BASICO.svg';
import outfitRed from './assets/img/CONJUNTO_ROJOV3.svg';
import outfitBlue from './assets/img/CONJUNTO_AZULV2.svg';
import outfitYellow from './assets/img/CONJUNTO_AMARILLOV2.svg';
import thumbnail from './assets/img/thumbnail.png';
import head from './assets/img/CABEZA.png';
import KosmoModalBot from './KosmoModalBot';
import StoreComponent from './StoreComponent';
import { Link } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import {AuthProvider } from './AuthContext'; // Ajusta la ruta según sea necesario

const KosmoCustomizationComponent = () => {
  const [outfitIndex, setOutfitIndex] = useState(0);
  const outfits = [outfitRed, outfitBlue, outfitYellow];
  const [isChanging, setIsChanging] = useState(false);
  
  const previousOutfitIndex = (outfitIndex - 1 + outfits.length) % outfits.length;
  const nextOutfitIndex = (outfitIndex + 1) % outfits.length;

  const changeOutfit = (newIndex) => {
    setIsChanging(true);
    setTimeout(() => {
      setOutfitIndex(newIndex);
      setIsChanging(false);
    }, 500);
  };

  return (
    <div className="kosmo-customization-section">
      <button onClick={() => changeOutfit(previousOutfitIndex)}>{"<"}</button>
  
      {/* Outfit anterior */}
      <div className="kosmo-outfit-container">
        <img src={outfits[previousOutfitIndex]} alt="Previous Outfit" className="kosmo-outfit side-outfit" />
        <div className="outfit-shadow-side"></div>
      </div>
  
      {/* Outfit actual */}
      <div className="center-outfit">
        <img src={head} alt="Kosmo's Head" className="kosmo-head" />
        <img src={kosmoBotBasico} alt="Kosmo Bot Básico" className="kosmo-bot" />
        <div className="kosmo-outfit-container">
          <img src={outfits[outfitIndex]} alt="Current Outfit" className={`kosmo-outfit ${isChanging ? 'animate-change' : ''}`} />
          <div className="outfit-shadow"></div>
        </div>
      </div>
  
      {/* Outfit siguiente */}
      <div className="kosmo-outfit-container">
        <img src={outfits[nextOutfitIndex]} alt="Next Outfit" className="kosmo-outfit side-outfit" />
        <div className="shadow-side"></div>
      </div>
  
      <button onClick={() => changeOutfit(nextOutfitIndex)}>{">"}</button>
    </div>
  );
};



function App() {
  const [isHovering, setIsHovering] = useState(false);
  const [navExpanded, setNavExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { darkMode, toggleDarkMode } = useDarkMode();
  const { setIsAuthenticated } = useContext(AuthContext);


  const closeNav = () => {
    setNavExpanded(false);
  };


  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Asegúrate de configurar la URL de acuerdo a tu backend
          const response = await axios.get('/verify-token', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (response.data.isAuthenticated) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Error al verificar el token", error);
          setIsAuthenticated(false);
        }
      }
    };

    verifyToken();
  }, [setIsAuthenticated]);
  
  
  
const ChatButton = ({ setShowModal }) => {
  const location = useLocation();
  const chatButtonRef = useRef(null);
  const isMobile = window.innerWidth <= 768;

  const handleMouseMove = (event) => {
    if (!isMobile && chatButtonRef.current) {
      const { top, left, width, height } = chatButtonRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const deltaX = event.clientX - centerX;
      const deltaY = event.clientY - centerY;

      // Calcular el ángulo en radianes y convertirlo a grados
      let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

      // Ajustar el ángulo para la imagen invertida y mantenerlo en el semicírculo izquierdo
      if (angle < 0) {
        angle = (angle + 360) % 360; // Convertir ángulos negativos a positivos
      }
      if (angle > 0 && angle < 360) {
        // El ratón está a la izquierda de la imagen
        angle = angle - 180; // Esto invertirá el ángulo para que la imagen "mire" hacia la izquierda
      } else {
        // El ratón está a la derecha de la imagen
        if (angle <= 90) {
          angle = 90; // Límite superior para el movimiento a la izquierda
        } else {
          angle = -90; // Límite inferior para el movimiento a la derecha
        }
      }

      // Establecer el estilo de transformación directamente en el botón
      chatButtonRef.current.style.transform = `rotate(${angle}deg)`;
    }
  };

    useEffect(() => {
      if (!isMobile) {
        // Agregar el controlador de eventos al mover el mouse en el documento solo si no es móvil
        document.addEventListener('mousemove', handleMouseMove);
      }
  
      return () => {
        if (!isMobile) {
          // Limpiar el evento al desmontar el componente solo si no es móvil
          document.removeEventListener('mousemove', handleMouseMove);
        }
      };
    // Añadir isMobile a la lista de dependencias del efecto para volver a aplicarlo si cambia
    }, [isMobile]);

    // Determina si el botón debe mostrarse basado en la ruta
    const isVisible = location.pathname !== '/tryme';

    return isVisible ? (
      <button ref={chatButtonRef} className="chat-button-modal" onClick={() => setShowModal(true)}>
        <img src={head} alt="Chat con Kosmo" style={{ transform: 'scaleX(-1)' }} />
      </button>
    ) : null;
};


useEffect(() => {
  document.body.className = darkMode ? 'dark-mode' : '';
}, [darkMode]);

  useEffect(() => {
    const updateContentMargin = () => {
      const navbarHeight = document.querySelector('.navbar').offsetHeight;
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.style.marginTop = `${navbarHeight}px`;
      }
    };

    window.addEventListener('resize', updateContentMargin);
    updateContentMargin();

    return () => window.removeEventListener('resize', updateContentMargin);
  }, [navExpanded]);

  const toggleNav = () => {
    setNavExpanded(!navExpanded);
  };



  return (
    <AuthProvider>
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
    <Router>
      <nav className={`navbar navbar-expand-lg fixed-top`}>
        <div className="container">
          <Link to="/#inicio" className="navbar-brand-link">
            <div
              className="navbar-brand"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onTouchStart={() => setIsHovering(true)}
              onTouchEnd={() => setIsHovering(false)}
            >
              {isHovering ? (
                <span className="navbar-text-logo">Kosmo</span>
              ) : (
                <img src={logo} alt="Logo Kosmo" className="brand-logo" />
              )}
            </div>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleNav}
            aria-controls="navbarNav"
            aria-expanded={navExpanded}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
        <div className={`collapse navbar-collapse ${navExpanded ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item" onClick={closeNav}>
              <NavLink className="nav-link" to="/#inicio">Inicio</NavLink>
            </li>
            <li className="nav-item" onClick={closeNav}>
              <NavLink className="nav-link" to="/#nosotros">Nosotros</NavLink>
            </li>
            <li className="nav-item" onClick={closeNav}>
              <NavLink className="nav-link" to="/#planes">Planes</NavLink>
            </li>
            <li className="nav-item" onClick={closeNav}>
              <NavLink className="nav-link" to="/#contactanos">Contáctanos</NavLink>
            </li>
            {isAuthenticated ? (
                <>
                  <li className="nav-item" onClick={closeNav}>
                    <Link className="nav-link" to="/mi-sesion">Mi Sesión</Link>
                  </li>
                  <li className="nav-item" onClick={closeNav}>
                    <button className="nav-link" onClick={logout}>Cerrar sesión</button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item" onClick={closeNav}>
                    <NavLink className="nav-link" to="/login">Login</NavLink>
                  </li>
                  <li className="nav-item" onClick={closeNav}>
                    <NavLink className="nav-link" to="/registrarse">Registrarse</NavLink>
                  </li>
                </>
              )}

            <li className="nav-item" onClick={closeNav}>
              <div> {/* Ajusta el padding o el width según necesites */}
                <button className="nav-link-button" onClick={toggleDarkMode}>
                  Modo Oscuro
                </button>
              </div>
            </li>
          </ul>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/registrarse" element={<RegisterComponent />} />
        <Route path="/tryme" element={<KosmoTryComponent />} />
        <Route path="/store" element={<PrivateRoute><StoreComponent /></PrivateRoute>} />
      </Routes>
      <ChatButton setShowModal={setShowModal} />
      {showModal && <KosmoModalBot onClose={() => setShowModal(false)} />}
    </Router>
    </div>
    </AuthProvider>
  );
}



function MainPage() {
  const location = useLocation();
  const navigate = useNavigate(); // Agrega esta línea
  const [activeIndex, setActiveIndex] = useState(0);
  const { darkMode } = useDarkMode();

  const handleSelect = (selectedIndex, e) => {
    setActiveIndex(selectedIndex);
  };

  useEffect(() => {
    const handleScrollToSection = () => {
      const { hash } = window.location;
      if (hash !== '') {
        setTimeout(() => {
          const section = document.querySelector(hash);
          if (section) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const position = section.offsetTop - navbarHeight;
            window.scrollTo({
              top: position,
              behavior: 'smooth',
            });
          }
        }, 0);
      }
    };

    if (location.pathname === '/') {
      handleScrollToSection();
    }
  }, [location]);
  
  useEffect(() => {
    const starsContainer = document.querySelector('.stars-container');
    createStars(starsContainer, 120);
  }, []);

  function createStars(container, numberOfStars) {
    for (let i = 0; i < numberOfStars; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const xPos = Math.random() * 100;
      const yPos = Math.random() * 100;
      const starSize = Math.random() * (0.2 - 0.1) + 0.1;

      star.style.left = `${xPos}vw`;
      star.style.top = `${yPos}vw`;
      star.style.width = `${starSize}vw`;
      star.style.height = `${starSize}vw`;

      container.appendChild(star);
    }
  }

    return (
      
      <div className={`main-page ${darkMode ? 'dark-mode' : ''}`}>
        <div id="inicio" className={`main-content ${darkMode ? 'dark-mode' : ''}`}>
          <img src={kosmoLogo} alt="Kosmo Logo" className="kosmo-logo" style={{ width: '900px' }} />
          <h2>UN CHATBOT DE OTRO PLANETA</h2>
          <p>Únete y conócelo</p>
          <button className="button-talk-kosmo" onClick={() => navigate('/tryme')}>Hablar con Kosmo</button>
        </div>
        <div className="space-container">
          <div className="stars-container"></div>
          <div className="ship-orbit">
            <img src={ship} alt="Nave Espacial" className="ship" />
          </div>
          <img src={earth} alt="Media planeta" className="earth" />
        </div>
        <div id="nosotros" className={`section-nosotros ${darkMode ? 'dark-mode' : ''}`}>
          <h2 className="nosotros-title">¿QUIÉNES SOMOS? CONOCE NUESTRA HISTORIA Y ÚNETE A NUESTRA ESTRATEGIA</h2>
          <Carousel activeIndex={activeIndex} onSelect={handleSelect} interval={null}>
          <Carousel.Item className="item-con-video-y-texto">
              <div className="video-y-texto-container">
                <div className="video-container">
                  <h2 className="video-title-along">NUESTRA HISTORIA</h2>
                  <video className="video-personalizado" controls poster={thumbnail}>
                  <source src={aboutVideo} type="video/mp4" />
                </video>
                </div>
                <div className="texto-al-lado">
                  <h4 className="strategy-title">NUESTRA ESTRATEGIA TRIFÁSICA</h4>
                  <div className="strategy-point-along">
                  <h5>LA IMPORTANCIA DE LOS BOTS</h5>
                  <p>En Kosmo, entendemos que los chatbots son más que simples programas...</p>
                </div>
                <div className="strategy-point-along">
                  <h5>EL ORIGEN DE NUESTRA IDEA</h5>
                  <p>Kosmo nace de necesidad clara...</p>
                </div>
                <div className="strategy-point-along">
                  <h5>NUESTRO EQUIPO</h5>
                  <p>Compuesto por innovadores, desarrolladores y creativos...</p>
                </div>
              </div>
            </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="carousel-strategy-container">
                <h4 className="strategy-title">NUESTRA ESTRATEGIA TRIFÁSICA</h4>
                <div className="strategy-point">
                  <h5>LA IMPORTANCIA DE LOS BOTS</h5>
                  <p>En Kosmo, entendemos que los chatbots son más que simples programas...</p>
                </div>
                <div className="strategy-point">
                  <h5>EL ORIGEN DE NUESTRA IDEA</h5>
                  <p>Kosmo nace de necesidad clara...</p>
                </div>
                <div className="strategy-point">
                  <h5>NUESTRO EQUIPO</h5>
                  <p>Compuesto por innovadores, desarrolladores y creativos...</p>
                </div>
              </div>
            </Carousel.Item>
          </Carousel>
        </div>
        <div id="planes" className="planes-section">
      <h3>NUESTROS PLANES</h3>
      <div className="planes-cards">
        {/* Tarjeta para el Tier Básico */}
        <div className="card">
          <img src={kosmoBasic} className="card-img-top" alt="Kosmo Basic"/>
          <div className="card-body">
            <h5 className="card-title">KOSMO TIER BÁSICO  - $29 dolares/mes</h5>
            <p className="card-text">
              Asistencia 24/7 por Kosmo IA. Un bot con la personalidad por defecto para comunicación y ventas.
            </p>
            <p className="card-text">
              Un ID único para administrar tus bots.
            </p>
          </div>
        </div>

        {/* Tarjeta para el Tier Intermedio */}
        <div className="card">
          <img src={kosmoOxxo} className="card-img-top" alt="Kosmo Oxxo" />
          <div className="card-body">
            <h5 className="card-title">KOSMO TIER INTERMEDIO - $79 dolares/mes</h5>
            <p className="card-text">
              Incluye todo lo del Tier Básico. 
            </p>
            <p className="card-text">
              Personalización de la imagen de tu bot. 
            </p>
            <p className="card-text">
              Varios bots con personalidades únicas.
            </p>
            <p className="card-text">
              Acceso mejorado a herramientas de análisis.
            </p>
          </div>
        </div>

        {/* Tarjeta para el Tier Premium */}
        <div className="card">
          <img src={kosmoConstructor} className="card-img-top" alt="Kosmo Constructor" />
          <div className="card-body">
            <h5 className="card-title">KOSMO TIER PREMIUM - $129 dolares/mes</h5>
            <p className="card-text">
              Todos los beneficios de los Tiers anteriores. 
            </p>
            <p className="card-text">
              Acceso prioritario a atención al cliente.
            </p>
            <p className="card-text">
              Herramientas de imagen y lenguaje adicionales para una mayor personalización.
            </p>
          </div>
        </div>
      </div>
    </div>
        {/* Sección de personalización de Kosmo */}
        <div id="custom" className={`customization-section ${darkMode ? 'dark-mode' : ''}`}>
          <h2>¡SERVICIO COMPLETO DE PERSONALIZACIÓN!</h2>
          <KosmoCustomizationComponent />
          <p className="customization-description">
            PUEDES ELEGIR ENTRE CAMBIAR SU ASPECTO, AGREGAR PROPS QUE FORTALEZCAN SU <br />
            PERSONALIDAD O CAMBIAR EL ESTILO EN QUE ESTE SE COMUNICA
            <span className="service-notice">
              *Para acceder a todas estas funciones, asegúrate de contar con el servicio de pago adecuado.
            </span>
          </p>
        </div>
        <div className="footer">
          <p>© Kosmo. Todos los derechos reservados.</p>
        </div>
      </div>
    );
  }

export default App;
