const express = require('express');
const router = express.Router();
const db = require('../db');

// @route   GET api/servicios
// @desc    Obtener todos los servicios activos
// @access  Public
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT nombre, descripcion FROM servicios WHERE estado = 'ACTIVO'");
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
