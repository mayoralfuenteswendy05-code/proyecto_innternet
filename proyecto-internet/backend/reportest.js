const express = require('express');
const router = express.Router();
const db = require('./bd');

router.post('/reportest', (req, res) => {
  console.log('Payload recibido en reportest:', req.body);

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

  db.query('SELECT Costo FROM servicio WHERE Id_Servicio = ?', [idServicio], (err, rows) => {
    if (err || rows.length === 0) {
      console.error('Error al obtener costo:', err);
      return res.status(500).json({ error: 'No se pudo obtener el costo del servicio' });
    }

    const costo = rows[0].Costo; 

    const insertQuery = `
      INSERT INTO reportes (idCliente, nombreCliente, correoElectronico, telefono, idServicio, nombreServicio, ubicacion, costo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(insertQuery, [idCliente, nombreCliente, correoElectronico, telefono, idServicio, nombreServicio, ubicacion, costo], (err) => {
      if (err) {
        console.error('Error al insertar reporte:', err);
        return res.status(500).json({ error: 'No se pudo guardar el reporte técnico' });
      }

      res.status(200).json({
        message: '✅ Reporte técnico enviado y guardado correctamente',
        cliente: { idCliente, nombreCliente, correoElectronico, telefono },
        servicio: { idServicio, nombreServicio, costo },
        ubicacion
      });
    });
  });
});

router.get('/reportest', (req, res) => {
  db.query('SELECT * FROM reportes', (err, rows) => {
    if (err) {
      console.error('Error al obtener reportes:', err);
      return res.status(500).json({ error: 'No se pudieron obtener los reportes' });
    }
    res.json(rows);
  });
});

module.exports = router;