import React, { useState, useEffect } from 'react';
import './FAQ.css';
import api from '../../api';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await api.get('/faqs');
        setFaqs(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const toggleFAQ = index => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (loading) {
    return (
      <section id="faq" className="faq-section">
        <div className="container">
          <h2>Preguntas Frecuentes</h2>
          <p>Cargando...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="faq" className="faq-section">
        <div className="container">
          <h2>Preguntas Frecuentes</h2>
          <p>Error: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="faq" className="faq-section">
      <div className="container">
        <h2>Preguntas Frecuentes</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                {faq.pregunta}
                <span>{activeIndex === index ? '-' : '+'}</span>
              </div>
              {activeIndex === index && (
                <div className="faq-answer">
                  <p>{faq.respuesta}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

