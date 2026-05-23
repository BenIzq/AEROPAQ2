const express = require('express');
const router = express.Router();
const db = require('../db');

// @route   GET api/informacion-empresa
// @desc    Obtener toda la información de la empresa (historia, misión, etc.)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT tipo, titulo, contenido FROM informacion_empresa");
    // Convert array to object for easier frontend access
    const infoObject = rows.reduce((acc, item) => {
      acc[item.tipo.toLowerCase()] = {
        titulo: item.titulo,
        contenido: item.contenido
      };
      return acc;
    }, {});
    res.json(infoObject);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
