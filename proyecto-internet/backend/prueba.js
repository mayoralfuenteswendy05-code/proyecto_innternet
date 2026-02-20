const bd = require('./bd').default;

bd.query('SELECT * FROM usuario', (err, results) => {
  if (err) {
    console.error('Error en la consulta:', err);
    return;
  }
  console.log('Usuarios:', results);
});