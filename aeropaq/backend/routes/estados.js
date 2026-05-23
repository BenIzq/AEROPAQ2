const express = require('express');
const router = express.Router();
const db = require('../db');

// @route   GET api/estados-envio
// @desc    Obtener todos los estados de envío posibles
// @access  Public (es información general)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id_estado, nombre FROM estados_envio");
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
