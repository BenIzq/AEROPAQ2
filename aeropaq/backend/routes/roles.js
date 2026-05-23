const express = require('express');
const router = express.Router();
const db = require('../db');
const admin = require('../middleware/admin');

// @route   GET api/roles
// @desc    Obtener todos los roles
// @access  Admin
router.get('/', admin, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id_rol, nombre FROM roles");
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
