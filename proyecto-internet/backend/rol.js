const express = require('express');
const router = express.Router();
const db = require('./bd'); 


router.get('/roles', (req, res) => {
  db.query('SELECT Id_Rol AS id, Nombre AS nombre FROM rol', (err, results) => {
    if (err) {
      console.error(' Error al obtener roles:', err);
      return res.status(500).json({ error: 'Error al obtener roles' });
    }
    res.json(results);
  });
});

// nuevo
router.post('/roles', (req, res) => {
  console.log(' Recibido en el backend:', req.body);

  const { nombre } = req.body;
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre del rol es obligatorio' });
  }

  db.query('INSERT INTO rol (Nombre) VALUES (?)', [nombre], (err, result) => {
    if (err) {
      console.error(' Error al insertar rol:', err);
      return res.status(500).json({ error: 'Error al insertar rol' });
    }
    res.status(201).json({ id: result.insertId });
  });
});

//actualiza
router.put('/roles/:id', (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre del rol es obligatorio' });
  }

  db.query('UPDATE rol SET Nombre = ? WHERE Id_Rol = ?', [nombre, id], (err) => {
    if (err) {
      console.error(' Error al actualizar rol:', err);
      return res.status(500).json({ error: 'Error al actualizar rol' });
    }
    res.json({ message: ' Rol actualizado correctamente' });
  });
});

//elimina
router.delete('/roles/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM rol WHERE Id_Rol = ?', [id], (err) => {
    if (err) {
      console.error(' Error al eliminar rol:', err);
      return res.status(500).json({ error: 'Error al eliminar rol' });
    }
    res.json({ message: ' Rol eliminado correctamente' });
  });
});

module.exports = router;