import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Componentes de estructura
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

// Componentes de autenticación
import RutaProtegida from './components/Auth/RutaProtegida';

// Páginas
import LandingPage from './pages/LandingPage';
import Services from './components/Services/Services';
import Coverage from './components/Coverage/Coverage';
import AboutUs from './components/AboutUs/AboutUs';
import FAQ from './components/FAQ/FAQ';
import Contact from './components/Contact/Contact';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Cotizador from './components/Cotizador/Cotizador';
import MisEnvios from './components/Envios/MisEnvios';
import AdminPanel from './components/Admin/AdminPanel';


function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/servicios" element={<Services />} />
          <Route path="/cobertura"  element={<Coverage />} />
          <Route path="/nosotros" element={<AboutUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/cotizador" element={<Cotizador />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />

          {/* Rutas Protegidas */}
          <Route element={<RutaProtegida roles={['CLIENTE', 'ADMIN']} />}>
            <Route path="/mis-envios" element={<MisEnvios />} />
          </Route>
          <Route element={<RutaProtegida roles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>

        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
