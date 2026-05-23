const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Bienvenido al backend de SkyShip!');
});

app.use('/api/contactos', require('./routes/contactos'));
app.use('/api/servicios', require('./routes/servicios'));
app.use('/api/informacion-empresa', require('./routes/informacion'));
app.use('/api/faqs', require('./routes/faqs'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/envios', require('./routes/envios'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/estados-envio', require('./routes/estados'));


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
