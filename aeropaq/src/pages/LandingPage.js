import React from 'react';
import Home from '../components/Home/Home';
import Services from '../components/Services/Services';
import Coverage from '../components/Coverage/Coverage';
import HowItWorks from '../components/HowItWorks/HowItWorks';
import AboutUs from '../components/AboutUs/AboutUs';
import FAQ from '../components/FAQ/FAQ';
import Contact from '../components/Contact/Contact';
import Cotizador from '../components/Cotizador/Cotizador';

const LandingPage = () => {
  return (
    <>
      <Home />
      <Services />
      <Coverage />
      <HowItWorks />
      <AboutUs />
      <FAQ />
      <Contact />
      <Cotizador />
    </>
  );
};

export default LandingPage;
