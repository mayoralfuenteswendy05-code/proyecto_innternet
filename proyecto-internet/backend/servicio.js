const express = require('express');
const router = express.Router();
const db = require('./bd'); 

router.get('/servicios', (req, res) => {
db.query('SELECT Id_Servicio AS idServicio, Nombre AS nombreServicio, Costo AS costo, Descripcion AS descripcion FROM servicio',
  (err, results) => {
    if (err) {
      console.error(' Error al obtener servicios:', err);
      return res.status(500).json({ error: 'Error al obtener los servicios' });
    }
    res.json(results);
  }
);
});


// registro
router.post('/servicios', (req, res) => {
  console.log(' Recibido en el backend:', req.body);

  const { nombreServicio, costo, descripcion } = req.body;

 
  if (!nombreServicio || !costo || !descripcion) {
    return res.status(400).json({ error: 'Todos los campos (nombre, costo, descripcion) son obligatorios' });
  }

  db.query(
    'INSERT INTO servicio (Nombre, Costo, Descripcion) VALUES (?, ?, ?)',
    [nombreServicio, costo, descripcion],
    (err, result) => {
      if (err) {
        console.error(' Error al insertar servicio:', err);
        return res.status(500).json({ error: 'Error al insertar servicio' });
      }
      res.status(201).json({ idServicio: result.insertId });
    }
  );
});

// actualizar
router.put('/servicios/:idServicio', (req, res) => {
  const { idServicio } = req.params;
  const { nombreServicio, costo, descripcion } = req.body;

  if (!nombreServicio || !costo || !descripcion) {
    return res.status(400).json({ error: 'Todos los campos (nombre, costo, descripcion) son obligatorios' });
  }

  db.query(
    'UPDATE servicio SET Nombre = ?, Costo = ?, Descripcion = ? WHERE Id_Servicio = ?',
    [nombreServicio, costo, descripcion, idServicio],
    (err) => {
      if (err) {
        console.error(' Error al actualizar servicio:', err);
        return res.status(500).json({ error: 'Error al actualizar servicio' });
      }
      res.json({ message: ' Servicio actualizado correctamente' });
    }
  );
});

// eliminar
router.delete('/servicios/:idServicio', (req, res) => {
  const { idServicio } = req.params;

  db.query('DELETE FROM servicio WHERE Id_Servicio = ?', [idServicio], (err) => {
    if (err) {
      console.error(' Error al eliminar servicio:', err);
      return res.status(500).json({ error: 'Error al eliminar servicio' });
    }
    res.json({ message: ' Servicio eliminado correctamente' });
  });
});

module.exports = router;