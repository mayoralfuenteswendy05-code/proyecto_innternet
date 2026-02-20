const express = require('express');
const router = express.Router();
const db = require('./bd');

router.get('/empleados', (req, res) => {
  const sql = `
  SELECT 
  empleado.Id_Empleado AS idempleado, 
  empleado.Nombre AS nombrempleado, 
  A_Paterno AS aPaterno, 
  A_Materno AS aMaterno, 
  C_Electronico AS cElectronico, 
  N_Telefono AS nTelefono, 
  Direccion AS direccion,
  contrasena AS contrasena,
  rol.Nombre AS Nombre
  FROM empleado
  JOIN rol ON empleado.Id_Rol = rol.Id_Rol;
`;
  db.query(sql, (err, results) => {
  if (err) {
    console.error('❌ Error al obtener empleados:', err.sqlMessage); 
    return res.status(500).json({ error: 'Error al obtener los empleados' });
  }
  console.log('📊 Resultados:', results);
  res.json(results);
});
});

// Registrar nuevo empleado
router.post('/empleados', (req, res) => {
  console.log('📥 Recibido en el backend:', req.body);

  const { nombrempleado, aPaterno, aMaterno, cElectronico, nTelefono, direccion, idRol, contrasena } = req.body;

  if (!nombrempleado || !aPaterno || !aMaterno || !cElectronico || !nTelefono || !direccion || !idRol || !contrasena) {
    return res.status(400).json({ error: 'Todos los campos (nombre, apellidos, correo, teléfono, dirección, rol, contrasena) son obligatorios' });
  }

  db.query(
    'INSERT INTO empleado (Nombre, A_Paterno, A_Materno, C_Electronico, N_Telefono, Direccion, Id_Rol, contrasena) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [nombrempleado, aPaterno, aMaterno, cElectronico, nTelefono, direccion, idRol, contrasena],
    (err, result) => {
      if (err) {
        console.error('❌ Error al insertar empleado:', err);
        return res.status(500).json({ error: 'Error al insertar empleado' });
      }
      res.status(201).json({ idempleado: result.insertId });
    }
  );
});

// Actualizar empleado
router.put('/empleados/:idempleado', (req, res) => {
  const { idempleado } = req.params;
  const { nombrempleado, aPaterno, aMaterno, cElectronico, nTelefono, direccion, idRol, contrasena } = req.body;

  if (!nombrempleado || !aPaterno || !aMaterno || !cElectronico || !nTelefono || !direccion || !idRol || !contrasena) {
    return res.status(400).json({ error: 'Todos los campos (nombre, apellidos, correo, teléfono, dirección, rol, contrasena) son obligatorios' });
  }

  db.query(
    'UPDATE empleado SET Nombre = ?, A_Paterno = ?, A_Materno = ?, C_Electronico = ?, N_Telefono = ?, Direccion = ?, Id_Rol = ?, contrasena = ? WHERE Id_Empleado = ?',
    [nombrempleado, aPaterno, aMaterno, cElectronico, nTelefono, direccion, idRol, contrasena, idempleado],
    (err) => {
      if (err) {
        console.error('❌ Error al actualizar empleado:', err);
        return res.status(500).json({ error: 'Error al actualizar empleado' });
      }
      res.json({ message: '✅ Empleado actualizado correctamente' });
    }
  );
});

// Eliminar empleado
router.delete('/empleados/:idempleado', (req, res) => {
  const { idempleado } = req.params;

  db.query('DELETE FROM empleado WHERE Id_Empleado = ?', [idempleado], (err) => {
    if (err) {
      console.error('❌ Error al eliminar empleado:', err);
      return res.status(500).json({ error: 'Error al eliminar empleado' });
    }
    res.json({ message: '🗑️ Empleado eliminado correctamente' });
  });
});

module.exports = router;