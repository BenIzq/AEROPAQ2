const auth = require('./auth');

const admin = (req, res, next) => {
 
  auth(req, res, () => {
    
    if (req.usuario && req.usuario.rol === 'ADMIN') {
      next();
    } else {
      res.status(403).json({ msg: 'Acceso denegado. Se requiere rol de administrador.' });
    }
  });
};

module.exports = admin;
