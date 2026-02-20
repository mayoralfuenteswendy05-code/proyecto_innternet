const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/geocode', async (req, res) => {
  const direccion = req.query.direccion;
  if (!direccion) {
    return res.status(400).json({ error: 'Falta la dirección' });
  }

  // 🔹 Detectar si es coordenada
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
    console.error('Error al obtener coordenadas:', err);
    res.status(500).json({ error: 'Error al obtener coordenadas' });
  }
});
module.exports = router;