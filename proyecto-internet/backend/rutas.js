const express = require('express');
const router = express.Router();
const db = require('./bd');
const axios = require('axios');

router.get('/clientes', (req, res) => {
  const sql = `
    SELECT 
      Id_Cliente AS idCliente,
      Nombre AS nombreCliente,
      A_Paterno AS apellidoPaterno,
      A_Materno AS apellidoMaterno,
      C_Electronico AS correoElectronico,
      N_Telefono AS telefono,
      Direccion AS direccion
    FROM cliente
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener clientes' });
    res.json(results);
  });
});

router.get('/cliente-servicio', (req, res) => {
  const sql = `
    SELECT 
      Id_ClienteServicio AS idClienteServicio,
      Id_Cliente AS idCliente,
      Id_Servicio AS idServicio,
      Ubicacion AS ubicacion
    FROM cliente_servicio
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener asignaciones' });
    res.json(results);
  });
});

router.get('/geocode', async (req, res) => {
  const direccion = req.query.direccion;
  if (!direccion) return res.status(400).json({ error: 'Falta la dirección' });

  const regexCoords = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;
  if (regexCoords.test(direccion)) {
    const [lat, lon] = direccion.split(',').map(Number);
    return res.json({ lat, lng: lon });
  }

  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { q: direccion, format: 'json', limit: 1 }
    });
    if (response.data.length > 0) {
      const { lat, lon } = response.data[0];
      res.json({ lat, lng: lon });
    } else {
      res.status(404).json({ error: 'No se encontraron coordenadas' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener coordenadas' });
  }
});

module.exports = router;