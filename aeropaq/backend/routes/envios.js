const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid'); // Para generar códigos de guía únicos

// @route   GET api/envios
// @desc    Obtener los envíos del usuario autenticado
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const [envios] = await db.query(
      `SELECT e.codigo_guia, e.destino, e.fecha_creacion, es.nombre as estado, e.costo_estimado 
       FROM envios e
       JOIN estados_envio es ON e.id_estado = es.id_estado
       WHERE e.id_usuario = ? 
       ORDER BY e.fecha_creacion DESC`,
      [req.usuario.id]
    );
    res.json(envios);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   POST api/envios
// @desc    Crear un nuevo envío
// @access  Private
router.post('/', auth, async (req, res) => {
  const { origen, destino, descripcion_paquete, peso, costo_estimado } = req.body;

  if (!origen || !destino || !peso || !costo_estimado) {
    return res.status(400).json({ msg: 'Por favor, proporcione origen, destino, peso y costo estimado.' });
  }

  try {
    // Generar un código de guía único (ej: SKY-5A8F-4D9C)
    const codigo_guia = `SKY-${uuidv4().split('-')[1].toUpperCase()}-${uuidv4().split('-')[0].substring(0, 4).toUpperCase()}`;

    // Obtener el id del estado 'CREADO'
    const [estadoRows] = await db.query("SELECT id_estado FROM estados_envio WHERE nombre = 'CREADO'");
    if (estadoRows.length === 0) {
      return res.status(500).json({ msg: 'El estado inicial del envío no está definido en la BD.' });
    }
    const idEstadoCreado = estadoRows[0].id_estado;

    const newEnvio = {
      codigo_guia,
      id_usuario: req.usuario.id,
      id_estado: idEstadoCreado,
      origen,
      destino,
      descripcion_paquete,
      peso,
      costo_estimado,
    };

    const [result] = await db.execute(
      'INSERT INTO envios (codigo_guia, id_usuario, id_estado, origen, destino, descripcion_paquete, peso, costo_estimado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [newEnvio.codigo_guia, newEnvio.id_usuario, newEnvio.id_estado, newEnvio.origen, newEnvio.destino, newEnvio.descripcion_paquete, newEnvio.peso, newEnvio.costo_estimado]
    );

    res.status(201).json({ msg: 'Envío creado exitosamente', id_envio: result.insertId, ...newEnvio });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
