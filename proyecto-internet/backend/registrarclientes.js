const express = require('express');
const router = express.Router();
const db = require('./bd');

router.get('/clientes', (req, res) => {
  db.query(
    'SELECT Id_Cliente AS idCliente, Nombre AS nombreCliente, A_Paterno AS apellidoPaterno, A_Materno AS apellidoMaterno, C_Electronico AS correoElectronico, N_Telefono AS telefono, Direccion AS direccion FROM cliente',
    (err, results) => {
      if (err) {
        console.error('Error al obtener clientes:', err);
        return res.status(500).json({ error: 'Error al obtener los clientes' });
      }
      res.json(results);
    }
  );
});

// nuevo cliente
router.post('/clientes', (req, res) => {
  console.log(' Recibido en el backend:', req.body);

  const { nombreCliente, apellidoPaterno, apellidoMaterno, correoElectronico, telefono, direccion } = req.body;

  if (!nombreCliente || !apellidoPaterno || !apellidoMaterno || !correoElectronico || !telefono || !direccion) {
    return res.status(400).json({ error: 'Todos los campos (nombre, apellidos, correo, teléfono, dirección) son obligatorios' });
  }

  db.query(
    'INSERT INTO cliente (Nombre, A_Paterno, A_Materno, C_Electronico, N_Telefono, Direccion) VALUES (?, ?, ?, ?, ?, ?)',
    [nombreCliente, apellidoPaterno, apellidoMaterno, correoElectronico, telefono, direccion],
    (err, result) => {
      if (err) {
        console.error('Error al insertar cliente:', err);
        return res.status(500).json({ error: 'Error al insertar cliente' });
      }
      res.status(201).json({ idCliente: result.insertId });
    }
  );
});

//actualizamos
router.put('/clientes/:idCliente', (req, res) => {
  const { idCliente } = req.params;
  const { nombreCliente, apellidoPaterno, apellidoMaterno, correoElectronico, telefono, direccion } = req.body;

  if (!nombreCliente || !apellidoPaterno || !apellidoMaterno || !correoElectronico || !telefono || !direccion) {
    return res.status(400).json({ error: 'Todos los campos (nombre, apellidos, correo, teléfono, dirección) son obligatorios' });
  }

  db.query(
    'UPDATE cliente SET Nombre = ?, A_Paterno = ?, A_Materno = ?, C_Electronico = ?, N_Telefono = ?, Direccion = ? WHERE Id_Cliente = ?',
    [nombreCliente, apellidoPaterno, apellidoMaterno, correoElectronico, telefono, direccion, idCliente],
    (err) => {
      if (err) {
        console.error('Error al actualizar cliente:', err);
        return res.status(500).json({ error: 'Error al actualizar cliente' });
      }
      res.json({ message: ' Cliente actualizado correctamente' });
    }
  );
});

//eliminar
router.delete('/clientes/:idCliente', (req, res) => {
  const { idCliente } = req.params;

  db.query('DELETE FROM cliente WHERE Id_Cliente = ?', [idCliente], (err) => {
    if (err) {
      console.error(' Error al eliminar cliente:', err);
      return res.status(500).json({ error: 'Error al eliminar cliente' });
    }
    res.json({ message: ' Cliente eliminado correctamente' });
  });
});

module.exports = router;