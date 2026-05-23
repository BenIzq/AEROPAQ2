const express = require('express');
const router = express.Router();
const db = require('../db');
const admin = require('../middleware/admin');

// ============================
// GESTIÓN DE USUARIOS (ADMIN)
// ============================

// @route   GET api/admin/usuarios
// @desc    Obtener todos los usuarios
// @access  Admin
router.get('/usuarios', admin, async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT u.id_usuario, u.nombre_completo, u.correo, u.telefono, u.direccion, r.nombre as rol, u.estado 
       FROM usuarios u
       JOIN roles r ON u.id_rol = r.id_rol
       ORDER BY u.fecha_creacion DESC`
    );
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   PUT api/admin/usuarios/:id
// @desc    Actualizar un usuario (rol, estado, etc.)
// @access  Admin
router.put('/usuarios/:id', admin, async (req, res) => {
  const { nombre_completo, correo, telefono, direccion, id_rol, estado } = req.body;
  const userId = req.params.id;

  try {
    // Verificar que el usuario existe
    const [userRows] = await db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [userId]);
    if (userRows.length === 0) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    await db.execute(
      `UPDATE usuarios SET 
         nombre_completo = ?, 
         correo = ?, 
         telefono = ?, 
         direccion = ?, 
         id_rol = ?, 
         estado = ? 
       WHERE id_usuario = ?`,
      [nombre_completo, correo, telefono, direccion, id_rol, estado, userId]
    );

    res.json({ msg: 'Usuario actualizado correctamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   DELETE api/admin/usuarios/:id
// @desc    Eliminar un usuario (cambiar estado a INACTIVO)
// @access  Admin
router.delete('/usuarios/:id', admin, async (req, res) => {
  const userId = req.params.id;
  try {
     // No se borra el registro, se inactiva para mantener la integridad referencial
    await db.execute("UPDATE usuarios SET estado = 'INACTIVO' WHERE id_usuario = ?", [userId]);
    res.json({ msg: 'Usuario desactivado correctamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// ============================
// GESTIÓN DE ENVÍOS (ADMIN)
// ============================

// @route   GET api/admin/envios
// @desc    Obtener todos los envíos de todos los usuarios
// @access  Admin
router.get('/envios', admin, async (req, res) => {
  try {
    const [envios] = await db.query(
      `SELECT e.id_envio, e.codigo_guia, u.nombre_completo as cliente, e.destino, e.fecha_creacion, es.nombre as estado, e.costo_estimado 
       FROM envios e
       JOIN estados_envio es ON e.id_estado = es.id_estado
       JOIN usuarios u ON e.id_usuario = u.id_usuario
       ORDER BY e.fecha_creacion DESC`
    );
    res.json(envios);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   PUT api/admin/envios/:id
// @desc    Actualizar el estado de un envío
// @access  Admin
router.put('/envios/:id', admin, async (req, res) => {
  const { id_estado } = req.body;
  const envioId = req.params.id;

  if (!id_estado) {
    return res.status(400).json({ msg: 'Se requiere el ID del nuevo estado.' });
  }

  try {
    await db.execute(
      'UPDATE envios SET id_estado = ? WHERE id_envio = ?',
      [id_estado, envioId]
    );
    res.json({ msg: 'Estado del envío actualizado correctamente.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// ============================
// DASHBOARD STATS (ADMIN)
// ============================

// @route   GET api/admin/stats
// @desc    Obtener estadísticas para el dashboard
// @access  Admin
router.get('/stats', admin, async (req, res) => {
  try {
    // 1. Totales
    const [totalUsers] = await db.query("SELECT COUNT(*) as count FROM usuarios WHERE id_rol = 2"); // Asumiendo id_rol 2 es CLIENTE
    const [totalEnvios] = await db.query("SELECT COUNT(*) as count FROM envios");

    // 2. Envíos por mes (últimos 12 meses)
    const [enviosPorMes] = await db.query(`
      SELECT DATE_FORMAT(fecha_creacion, '%Y-%m') as mes, COUNT(*) as cantidad
      FROM envios
      WHERE fecha_creacion >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY mes
      ORDER BY mes;
    `);

    res.json({
      totalUsuarios: totalUsers[0].count,
      totalEnvios: totalEnvios[0].count,
      enviosPorMes,
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});


module.exports = router;
