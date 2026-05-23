const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// @route   POST api/usuarios/registro
// @desc    Registrar un nuevo usuario cliente
// @access  Public
router.post('/registro', async (req, res) => {
  const { nombre_completo, correo, telefono, direccion, password } = req.body;

  // Validación simple
  if (!nombre_completo || !correo || !password || !telefono || !direccion) {
    return res.status(400).json({ msg: 'Por favor, ingrese todos los campos requeridos.' });
  }

  try {
    // 1. Verificar si el correo ya existe
    const [userRows] = await db.query('SELECT correo FROM usuarios WHERE correo = ?', [correo]);
    if (userRows.length > 0) {
      return res.status(400).json({ msg: 'El correo electrónico ya está registrado.' });
    }

    // 2. Obtener el id_rol para 'CLIENTE'
    const [roleRows] = await db.query("SELECT id_rol FROM roles WHERE nombre = 'CLIENTE'");
    if (roleRows.length === 0) {
      return res.status(500).json({ msg: 'El rol de cliente no está definido en la base de datos.' });
    }
    const idClienteRol = roleRows[0].id_rol;

    // 3. Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 4. Insertar usuario en la base de datos
    const [result] = await db.execute(
      'INSERT INTO usuarios (id_rol, nombre_completo, correo, telefono, direccion, password_hash) VALUES (?, ?, ?, ?, ?, ?)',
      [idClienteRol, nombre_completo, correo, telefono, direccion, password_hash]
    );

    res.status(201).json({ msg: 'Usuario registrado exitosamente', userId: result.insertId });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   POST api/usuarios/login
// @desc    Iniciar sesión y obtener token
// @access  Public
router.post('/login', async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ msg: 'Por favor, ingrese correo y contraseña.' });
  }

  try {
    // 1. Verificar si el usuario existe y obtener sus datos y rol
    const [rows] = await db.query(
      `SELECT u.id_usuario, u.nombre_completo, u.password_hash, r.nombre as rol 
       FROM usuarios u 
       JOIN roles r ON u.id_rol = r.id_rol 
       WHERE u.correo = ? AND u.estado = 'ACTIVO'`,
      [correo]
    );

    if (rows.length === 0) {
      return res.status(400).json({ msg: 'Credenciales inválidas.' });
    }

    const usuario = rows[0];

    // 2. Verificar la contraseña
    const isMatch = await bcrypt.compare(password, usuario.password_hash);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciales inválidas.' });
    }

    // 3. Crear y firmar el payload del token
    const payload = {
      usuario: {
        id: usuario.id_usuario,
        rol: usuario.rol
      }
    };

    // 4. Firmar y devolver el token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' }, // Token válido por 24 horas
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          usuario: {
            id: usuario.id_usuario,
            nombre: usuario.nombre_completo,
            rol: usuario.rol
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;