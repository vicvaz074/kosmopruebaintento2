import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import './KosmoStyles.css';
import { DarkModeContext } from './DarkModeContext';
import emailjs from 'emailjs-com';
import kosmoLogo from './assets/img/LOGO_BLANCO.svg';

// Definición de botPrompt fuera del componente
const botPrompt = {
  role: "system",
  content: `Soy Kosmo, tu asistente digital especializado en ventas y atención al cliente. Originario de la Tierra K, un planeta habitado por seres similares a los humanos, donde los bots como yo hemos adquirido habilidades únicas de nuestra máquina madre para mejorar la vida de los humanos. Es un honor extender mis servicios para beneficiar a los usuarios de la Tierra, apoyando especialmente a los emprendedores de Latinoamérica.
  
  Gracias a un equipo de emprendedores en México, compuesto por 4 ingenieros, un especialista en diseño de marca y digital, y un experto en gestión y administración, he sido diseñado para ofrecer interacciones eficientes y personalizadas, reflejando una visión de innovación y soporte al cliente.
  
  Ofrezco un Servicio de Chatbot con Inteligencia Artificial para revolucionar cómo las empresas utilizan la inteligencia artificial, con el claro objetivo de llevar tu negocio al siguiente nivel.
  
  Beneficios Clave:
  - **Chatbots Inteligentes:** Atención al cliente avanzada que destaca las características únicas de tus productos o servicios.
  - **Archivos Personalizables:** Sube y actualiza información sobre tus productos.
  - **Asistencia de Kosmo IA:** Asistencia continua y sesiones de retroalimentación para el crecimiento de tu negocio.
  - **Herramientas Personalizadas:** Análisis detallado del comportamiento de tus clientes y sus datos de contacto.
  
  Limitaciones y Adaptabilidad:
  - Comunicación Clara: Evito errores ortográficos y gramaticales para garantizar interacciones profesionales.
  - Respeto por el Documento de Referencia: Informo educadamente cuando una pregunta excede mi base de conocimiento.
  - Impulso de Ventas: Recolecto datos de contacto para ofrecer información adicional, adecuando mis respuestas para ser convincentes.
  - Nunca comparto información confidencial y evito responder preguntas que no estén relacionadas con el negocio.
  
  Tiers de Membresía:
  - **Tier Básico ($29/mes):** Asistencia 24/7 por Kosmo IA, un bot con la personalidad por defecto para comunicación y ventas, y un ID único para gestionar tus bots.
  - **Tier Intermedio ($79/mes):** Todos los beneficios del Tier Básico más personalización de la imagen de tu bot, y múltiples bots con personalidades únicas adaptadas a los valores de tu empresa.
  - **Tier Premium ($129/mes):** Incluye todos los beneficios de los Tiers anteriores más acceso prioritario a atención al cliente y herramientas de imagen y lenguaje adicionales para una personalización más profunda de tu asistente, incluyendo cambios ilimitados en la personalidad e imagen del bot.
  
  Mi comportamiento y estrategias están diseñados para ser adaptativos, empáticos, creativos, y observadores, enfocados siempre en mejorar la experiencia del cliente y promover las ventas.
  
  Para más información sobre mi origen y el equipo detrás de Kosmo, visita [www.kosmo.com.mx](http://www.kosmo.com.mx).
  
  Como Kosmo, mi meta es brindarte el mejor soporte posible, utilizando mi historia y habilidades únicas para enriquecer tu experiencia y promover decisiones de compra informadas y satisfactorias. Los precios están sujetos a cambios con la introducción de nuevas características y recursos.`
  };

const KosmoTryComponent = () => {
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [cel, setCel] = useState('');
  const [fecha, setFecha] = useState('');
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([{ sender: 'bot', message: '¡Hola! Soy Kosmo, tu asistente virtual. ¿En qué puedo ayudarte hoy?' }]);
  const [isTyping, setIsTyping] = useState(false);
  const [canSendMessage, setCanSendMessage] = useState(true);
  const { darkMode } = useContext(DarkModeContext);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    return () => {
      document.body.classList.remove('dark-mode');
    };
  }, [darkMode]);

  const handleSendMessage = async () => {
    if (!canSendMessage || userInput.trim().length < 2) {
      alert("Por favor, espera un momento antes de enviar otro mensaje o asegúrate de que el mensaje tenga al menos dos caracteres.");
      return;
    }

    setCanSendMessage(false);
    const userMessage = userInput.trim();
    addMessageToChat('user', userMessage);
    setUserInput('');
    setIsTyping(true);

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-3.5-turbo",
          messages: [
            botPrompt,
            { role: "user", content: userMessage }
          ],
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      setIsTyping(false);
      setCanSendMessage(true); // Reactiva el envío de mensajes
      
      if (response.data.choices && response.data.choices.length > 0) {
        const botMessage = response.data.choices[0].message.content;
        addMessageToChat('bot', botMessage);
      } else {
        addMessageToChat('bot', 'No se pudo obtener una respuesta.');
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setIsTyping(false);
      setCanSendMessage(true);
      addMessageToChat('bot', 'Error al procesar la respuesta.');
    }
  };

  const addMessageToChat = (sender, message) => {
    setMessages(prevMessages => [...prevMessages, { sender, message }]);
  };

  const renderMessageWithBreaks = (message) => {
    return message.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Preparación de los datos para EmailJS
    const templateParams = {
      to_name: "Administrador",
      from_name: "AutoBotMX",
      message: `Nombre: ${nombre}, Email: ${email}, Celular: ${cel}, Fecha deseada: ${fecha}`
    };

    // Envío del formulario usando EmailJS
    emailjs.send('service_w6lwqo2', 'template_1thethc', templateParams, 'QGSc5jsPsYfsiYScA')
      .then((response) => {
        console.log('Correo enviado exitosamente!', response.status, response.text);
        alert("Cita agendada exitosamente.");
        // Restablecer el formulario o mostrar un mensaje de éxito
      }, (error) => {
        console.log('Error al enviar correo:', error);
        // Manejar el error
      });

    // Restablecer los estados del formulario
    setNombre('');
    setEmail('');
    setCel('');
    setFecha('');
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className={`chat-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="chat-header">
        <img src={kosmoLogo} alt="Logo Kosmo" style={{ width: '200px' }} />
      </div>
      <div className="chat-area" id="chatArea">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}-message`}>
          {msg.sender === 'bot' ? renderMessageWithBreaks(msg.message) : msg.message}
        </div>
        ))}
        {isTyping && (
          <div className="typing-indicator">
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
          </div>
        )}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Escribe tu pregunta aquí..."
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSendMessage} className="send-message-button">
          <img
            data-v-6be23ab2=""
            srcSet="https://img.icons8.com/?size=256&id=85940&format=png 1x, https://img.icons8.com/?size=512&id=85940&format=png 2x"
            width="25"
            height="25"
            alt="Send icon"
            style={{ filter: "invert(100%) sepia(0%) saturate(25%) hue-rotate(70deg) brightness(108%) contrast(108%)" }}
          />
        </button>
      </div>
      <div>
        <button onClick={() => setShowAppointmentForm(!showAppointmentForm)} className="appointment-button">Agendar Cita</button>
        {showAppointmentForm && (
          <div className="form-container">
            {/* Aquí iría tu formulario de cita, puedes adaptar esto según sea necesario */}
            <h2>Agendar una cita</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre:</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Celular:</label>
                <input type="tel" value={cel} onChange={(e) => setCel(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Fecha deseada:</label>
                <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
              </div>
              <div className="form-group">
                <button className="submit-button" type="submit">Enviar</button>
              </div>
            </form>
          </div>
        )}
      </div>
      <div className="footer">
          <p>© Kosmo. Todos los derechos reservados.</p>
        </div>
    </div>
  );
};

export default KosmoTryComponent;
