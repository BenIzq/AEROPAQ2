const express = require('express');
const router = express.Router();
const db = require('../db');

// @route   GET api/destinos-internacionales
// @desc    Obtener todos los destinos internacionales activos
// @access  Public
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT pais, precio_base FROM destinos_internacionales WHERE estado = 'ACTIVO' ORDER BY pais ASC");
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
