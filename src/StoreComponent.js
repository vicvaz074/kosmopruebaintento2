import React, { useState, useContext } from 'react';
import { Button, Card, Container, Row, Col, Modal, ListGroup, ListGroupItem } from 'react-bootstrap';
import { DarkModeContext } from './DarkModeContext';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import kosmoBasic from './assets/img/KOSMO_BASICO.svg';
import kosmoOxxo from './assets/img/KOSMO_OXXO.svg';
import kosmoConstructor from './assets/img/KOSMO_CONSTRUCTOR.svg';
import './StoreComponent.css';


const plans = [
  {
    id: 'basic',
    title: 'KOSMO TIER BÁSICO - Suscripción Mensual',
    description: '$29 dolares/mes - Asistencia 24/7 por Kosmo IA. Un bot con la personalidad por defecto para comunicación y ventas. Un ID único para administrar tus bots.',
    image: kosmoBasic,
    price: '29', // Agregar precio aquí
  },
  {
    id: 'intermediate',
    title: 'KOSMO TIER INTERMEDIO - Suscripción Mensual',
    description: '$79 dolares/mes - Incluye todo lo del Tier Básico. Personalización de la imagen de tu bot. Varios bots con personalidades únicas. Acceso mejorado a herramientas de análisis.',
    image: kosmoOxxo,
    price: '79', // Agregar precio aquí
  },
  {
    id: 'premium',
    title: 'KOSMO TIER PREMIUM - Suscripción Mensual',
    description: '$129 dolares/mes - Todos los beneficios de los Tiers anteriores. Acceso prioritario a atención al cliente. Herramientas de imagen y lenguaje adicionales para una mayor personalización.',
    image: kosmoConstructor,
    price: '129', // Agregar precio aquí
  }
];

const StoreComponent = () => {
  const [cart, setCart] = useState({});
  const [show, setShow] = useState(false);
  const [purchaseCompleted, setPurchaseCompleted] = useState({});
  const { darkMode } = useContext(DarkModeContext);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  

  const handlePurchase = (plan) => {
    // Si ya se compró, no hacer nada
    if (purchaseCompleted[plan.id]) return;

    setCart(currentCart => {
      const existingItem = currentCart[plan.id];
      return {
        ...currentCart,
        [plan.id]: {
          ...plan,
          quantity: existingItem ? existingItem.quantity + 1 : 1,
        },
      };
    });
    setShow(true);
  };

  const handleRemove = (idToRemove) => {
    setCart(currentCart => {
      const newCart = { ...currentCart };
      delete newCart[idToRemove];
      return newCart;
    });
  };

  const calculateTotal = () => {
    return Object.values(cart).reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleClose = () => setShow(false);

  const handlePaymentSuccess = (planId) => {
    setPurchaseCompleted(prevState => ({...prevState, [planId]: true}));
    setShow(false); // Cierra el modal tras el pago exitoso
    setCart({}); // Limpia el carrito tras el pago exitoso
    setShowSuccessNotification(true); // Muestra la notificación de éxito
  
    // Oculta la notificación después de 4 segundos
    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 4000);
  };
  

  return (
    <PayPalScriptProvider options={{ "client-id": "Ac0qDlDi02O3I2ITV_94dnm3BFFMU3n872UKBZGHD4uPU5uqsDof_rPc9SZu5M2di2i_lkZZHuR3VxY4", "currency": "USD", "intent": "capture" }}>
      <Container className={`store-component ${darkMode ? 'dark-mode' : ''}`}>
        <h2 className="text-center mb-5">Explora Nuestros Planes</h2>
        <Row>
          {plans.map(plan => (
            <Col md={4} key={plan.id} className="mb-4">
              <Card className="h-100">
                <Card.Img variant="top" src={plan.image} />
                <Card.Body>
                  <Card.Title>{plan.title}</Card.Title>
                  <Card.Text>{plan.description}</Card.Text>
                  <Button variant="success" onClick={() => handlePurchase(plan)} disabled={purchaseCompleted[plan.id]}>
                    {purchaseCompleted[plan.id] ? 'Activado' : 'Comprar Ahora'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <Modal show={show} onHide={handleClose} size="lg" className="fade-in">
          <Modal.Header closeButton>
            <Modal.Title>Carrito de Compras</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ListGroup>
              {Object.values(cart).map((item, index) => (
                <ListGroupItem key={index} className="d-flex justify-content-between align-items-center">
                  {item.title} - ${item.price} x {item.quantity}
                  <Button variant="danger" size="sm" onClick={() => handleRemove(item.id)}>Eliminar</Button>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Modal.Body>
          <Modal.Footer>
            <div className="me-auto">
              <strong>Total: ${calculateTotal().toFixed(2)}</strong>
            </div>

            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: calculateTotal().toString(),
                    },
                  }],
                });
              }}
              onApprove={(data, actions) => {
                return actions.order.capture().then((details) => {
                  Object.keys(cart).forEach(planId => handlePaymentSuccess(planId));
                });
              }}
            />
          </Modal.Footer>
        </Modal>
        {showSuccessNotification && (
        <div className="notification-container" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: '1050' }}>
          <div className="alert alert-success alert-dismissible fade show" role="alert" style={{ display: 'flex', alignItems: 'center' }}>
            <i className="fas fa-check-circle" style={{ marginRight: '10px' }}></i>
            ¡Compra completada con éxito! Gracias por tu compra.
          </div>
        </div>
      )}
      </Container>
      <div className="footer">
        <p>© Kosmo. Todos los derechos reservados.</p>
      </div>
    </PayPalScriptProvider>
  );
}

export default StoreComponent;
