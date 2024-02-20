import React from 'react';
import KosmoTryComponent from './KosmoTryComponent';
import './KosmoModalBot.css';

const KosmoModalBot = ({ onClose }) => {
  return (
    <div className="modalBackdrop" onClick={onClose}>
      <div className="modalContent" onClick={e => e.stopPropagation()}>
        <KosmoTryComponent />
        <button onClick={onClose} className="closeModalButton">X</button>
      </div>
    </div>
  );
};

export default KosmoModalBot;