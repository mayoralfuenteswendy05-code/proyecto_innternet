const express = require('express');
const router = express.Router();
const db = require('./bd');


router.get('/cliente-servicio', (req, res) => {
  const sql = `
    SELECT 
      cliente_servicio.Id_ClienteServicio AS idclinteservicio,
      cliente.Id_Cliente AS idCliente,
      servicio.Id_Servicio AS idServicio,
      cliente_servicio.Ubicacion AS ubicacion,
      cliente.Nombre AS nombreCliente,
      servicio.Nombre AS nombreServicio
    FROM cliente_servicio
    INNER JOIN cliente ON cliente_servicio.Id_Cliente = cliente.Id_Cliente
    INNER JOIN servicio ON cliente_servicio.Id_Servicio = servicio.Id_Servicio
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener asignaciones cliente-servicio:', err);
      return res.status(500).json({ error: 'Error al obtener las asignaciones' });
    }
    res.json(results);
  });
});

router.post('/cliente-servicio', (req, res) => {
  const { idCliente, idServicio, ubicacion } = req.body;

  if (!idCliente || !idServicio || !ubicacion) {
    return res.status(400).json({ error: 'Los campos Id_Cliente, Id_Servicio y Ubicacion son obligatorios' });
  }

  db.query(
    'INSERT INTO cliente_servicio (Id_Cliente, Id_Servicio, Ubicacion) VALUES (?, ?, ?)',
    [idCliente, idServicio, ubicacion],
    (err, result) => {
      if (err) {
        console.error('Error al insertar asignación:', err);
        return res.status(500).json({ error: 'Error al insertar asignación cliente-servicio' });
      }

      const idclinteservicio = result.insertId;

      res.status(201).json({
        message: 'Cliente-servicio creado correctamente',
        idclinteservicio
      });
    }
  );
});

router.put('/cliente-servicio/:idclinteservicio', (req, res) => {
  const { idclinteservicio } = req.params;
  const { idCliente, idServicio, ubicacion } = req.body;

  if (!idCliente || !idServicio || !ubicacion) {
    return res.status(400).json({ error: 'Los campos Id_Cliente, Id_Servicio y Ubicacion son obligatorios' });
  }

  db.query(
    'UPDATE cliente_servicio SET Id_Cliente = ?, Id_Servicio = ?, Ubicacion = ? WHERE Id_ClienteServicio = ?',
    [idCliente, idServicio, ubicacion, idclinteservicio],
    (err) => {
      if (err) {
        console.error('Error al actualizar asignación:', err);
        return res.status(500).json({ error: 'Error al actualizar asignación cliente-servicio' });
      }
      res.json({ message: 'Asignación cliente-servicio actualizada correctamente' });
    }
  );
});

router.delete('/cliente-servicio/:idclinteservicio', (req, res) => {
  const { idclinteservicio } = req.params;

  db.query('DELETE FROM cliente_servicio WHERE Id_ClienteServicio = ?', [idclinteservicio], (err) => {
    if (err) {
      console.error('Error al eliminar asignación cliente-servicio:', err);
      return res.status(500).json({ error: 'Error al eliminar asignación cliente-servicio' });
    }
    res.json({ message: 'Asignación cliente-servicio eliminada correctamente' });
  });
});

router.post('/http://localhost:3001/reportest', (req, res) => {
  const {
    idCliente,
    nombreCliente,
    correoElectronico,
    telefono,
    idServicio,
    nombreServicio,
    ubicacion
  } = req.body;

  if (!idCliente || !idServicio || !ubicacion) {
    return res.status(400).json({ error: 'Faltan datos obligatorios del reporte técnico' });
  }

  // Obtener precio del servicio (se mantiene)
  db.query('SELECT Precio FROM servicio WHERE Id_Servicio = ?', [idServicio], (err, rows) => {
    if (err || rows.length === 0) {
      return res.status(500).json({ error: 'No se pudo obtener el precio del servicio' });
    }

    const precio = rows[0].Precio;

    res.status(200).json({
      message: '✅ Reporte técnico enviado correctamente',
      cliente: { id_Cliente: idCliente, Nombre: nombreCliente, C_Electronico: correoElectronico, N_Telefono: telefono },
      servicio: { id_Servicio: idServicio, Nombre: nombreServicio, precio },
      ubicacion
    });
  });
});

module.exports = router;