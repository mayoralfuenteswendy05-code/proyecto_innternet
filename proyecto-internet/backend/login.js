const express = require('express');
const router = express.Router();
const db = require('./bd'); 

router.post('/login', (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
  }

  db.query(
    'SELECT Id_Empleado, Nombre, C_Electronico, contrasena, Id_Rol FROM empleado WHERE C_Electronico = ? AND contrasena = ?',
    [correo, password],
    (err, results) => {
      if (err) {
        console.error('❌ Error en login:', err);
        return res.status(500).json({ error: 'Error en el servidor' });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
      }

      const usuario = results[0];
      let rol = '';
      switch (usuario.Id_Rol) {
        case 1: rol = 'admin'; break;
        case 2: rol = 'tecnico'; break;
        case 3: rol = 'cobrador'; break;
        case 4: rol = 'cliente'; break;
        default: rol = 'desconocido';
      }

      res.json({
        idEmpleado: usuario.Id_Empleado,
        nombre: usuario.Nombre,
        correo: usuario.C_Electronico,
        rol
      });
    }
  );
});

module.exports = router;