import React, { useState, useEffect } from 'react';
import './AboutUs.css';

const AboutUs = () => {
  const [info, setInfo] = useState({
    historia: null,
    mision: null,
    vision: null,
    valores: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await fetch('/api/informacion-empresa');
        if (!response.ok) {
          throw new Error('No se pudo obtener la información de la empresa.');
        }
        const data = await response.json();
        setInfo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, []);

  if (loading) {
    return (
      <section id="about-us" className="about-us-section">
        <div className="container">
          <h2 className="section-title">Sobre Nosotros</h2>
          <p>Cargando...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="about-us" className="about-us-section">
        <div className="container">
          <h2 className="section-title">Sobre Nosotros</h2>
          <p>Error: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="about-us" className="about-us-section">
      <div className="container">
        <h2 className="section-title">Sobre Nosotros</h2>

        <div className="about-grid">
          {info.historia && (
            <div className="card">
              <h3>{info.historia.titulo}</h3>
              <p>{info.historia.contenido}</p>
            </div>
          )}

          {info.mision && (
            <div className="card">
              <h3>{info.mision.titulo}</h3>
              <p>{info.mision.contenido}</p>
            </div>
          )}

          {info.vision && (
            <div className="card">
              <h3>{info.vision.titulo}</h3>
              <p>{info.vision.contenido}</p>
            </div>
          )}

          {info.valores && (
            <div className="card">
              <h3>{info.valores.titulo}</h3>
              <p>{info.valores.contenido}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
