import React from 'react';
import './HowItWorks.css';

const HowItWorks = () => {
  const stepsList = [
    {
      title: 'Solicitud',
      description: 'Realiza tu solicitud de envío a través de nuestra plataforma en línea.',
      icon: 'fas fa-file-alt',
    },
    {
      title: 'Recolección',
      description: 'Nuestro equipo recoge el paquete en la dirección que nos indiques.',
      icon: 'fas fa-box',
    },
    {
      title: 'Despacho',
      description: 'Clasificamos y despachamos tu paquete a su destino.',
      icon: 'fas fa-shipping-fast',
    },
    {
      title: 'Entrega',
      description: 'Entregamos tu paquete de forma segura y a tiempo en su destino final.',
      icon: 'fas fa-check-circle',
    },
  ];

  return (
    <section id="how-it-works" className="how-it-works-section">
      <div className="container">
        <h2>Cómo Funciona</h2>
        <div className="steps">
          {stepsList.map((step, index) => (
            <div key={index} className="step">
              <div className="step-icon">
                <i className={step.icon}></i>
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
