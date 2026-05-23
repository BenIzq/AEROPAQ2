const express = require('express');
const router = express.Router();
const db = require('../db');

// @route   POST api/contactos
// @desc    Crear un nuevo contacto
// @access  Public
router.post('/', async (req, res) => {
  const { nombre, correo, telefono, asunto, mensaje } = req.body;

  // Simple validation
  if (!nombre || !correo || !asunto || !mensaje) {
    return res.status(400).json({ msg: 'Por favor, rellene todos los campos obligatorios.' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO contactos (nombre, correo, telefono, asunto, mensaje) VALUES (?, ?, ?, ?, ?)',
      [nombre, correo, telefono, asunto, mensaje]
    );
    res.status(201).json({ msg: 'Mensaje enviado con éxito', contactId: result.insertId });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
