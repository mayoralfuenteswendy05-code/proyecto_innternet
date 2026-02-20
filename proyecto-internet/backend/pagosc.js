const express = require('express');
const router = express.Router();
const db = require('./bd');

router.get('/pagos', (req, res) => {
  const sql = `
    SELECT 
      cliente_servicio.Id_ClienteServicio,
      cliente.Id_Cliente,
      cliente.Nombre,
      cliente.A_Paterno,
      cliente.A_Materno,
      cliente.C_Electronico,
      cliente.N_Telefono,
      cliente.Direccion,
      servicio.Id_Servicio,
      servicio.Nombre AS nombreServicio,
      servicio.Costo,
      servicio.Descripcion,
      cliente_servicio.Ubicacion,
      pagos.Id_Pagos,
      pagos.Fecha_Pago,
      pagos.Vencimiento,
      pagos.Monto,
      pagos.Metodo_Pago,
      pagos.estadoPago,
      meses.Nombre AS nombreMes
    FROM cliente_servicio
    JOIN cliente ON cliente_servicio.Id_Cliente = cliente.Id_Cliente
    JOIN servicio ON cliente_servicio.Id_Servicio = servicio.Id_Servicio
    LEFT JOIN pagos ON cliente_servicio.Id_ClienteServicio = pagos.Id_ClienteServicio
    LEFT JOIN meses ON pagos.Id_Meses = meses.Id_Meses
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener pagos:', err);
      return res.status(500).json({ error: 'Error al obtener pagos' });
    }
    res.json(results);
  });
});

router.get('/meses', (req, res) => {
  const sql = 'SELECT Id_Meses, Nombre FROM meses';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener meses:', err);
      return res.status(500).json({ error: 'Error al obtener meses' });
    }
    res.json(results);
  });
});

router.post('/pagos', (req, res) => {
  const {
    Id_ClienteServicio,
    Id_Meses,
    Fecha_Pago,
    Vencimiento,
    Monto,
    Metodo_Pago
  } = req.body;

  if (!Id_ClienteServicio || !Fecha_Pago || !Monto || !Metodo_Pago) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const sql = `
    INSERT INTO pagos (
      Id_ClienteServicio, Id_Meses, Fecha_Pago, Vencimiento, Monto, Metodo_Pago, estadoPago
    ) VALUES (?, ?, ?, ?, ?, ?, 'Pendiente')
  `;

  db.query(sql, [Id_ClienteServicio, Id_Meses, Fecha_Pago, Vencimiento, Monto, Metodo_Pago], (err, result) => {
    if (err) {
      console.error('Error al registrar pago:', err);
      return res.status(500).json({ error: 'Error al registrar pago' });
    }
    res.status(201).json({ message: 'Pago registrado correctamente', idPago: result.insertId });
  });
});

router.put('/pagos/:idpagos', (req, res) => {
  const { idpagos } = req.params;
  const { estadoPago } = req.body;

  if (!estadoPago) {
    return res.status(400).json({ error: 'El campo estadoPago es obligatorio' });
  }

  db.query('UPDATE pagos SET estadoPago = ? WHERE Id_Pagos = ?', [estadoPago, idpagos], (err) => {
    if (err) {
      console.error('Error al actualizar pago:', err);
      return res.status(500).json({ error: 'Error al actualizar pago' });
    }
    res.json({ message: 'Estado de pago actualizado correctamente' });
  });
});

module.exports = router;