import React, { useState, useEffect } from 'react';
import './Services.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const icons = ['fas fa-truck', 'fas fa-globe-americas', 'fas fa-box-open', 'fas fa-rocket'];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/servicios');
        if (!response.ok) {
          throw new Error('No se pudo obtener la información de los servicios.');
        }
        const data = await response.json();
        setServices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section id="services" className="services-section">
        <div className="services-container">
          <h2>Nuestros Servicios</h2>
          <p>Cargando...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="services" className="services-section">
        <div className="services-container">
          <h2>Nuestros Servicios</h2>
          <p>Error: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="services-section">
      <div className="services-container">
        <h2>Nuestros Servicios</h2>
        <div className="services-wrapper">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">
                <i className={icons[index % icons.length]}></i>
              </div>
              <h3>{service.nombre}</h3>
              <p>{service.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
