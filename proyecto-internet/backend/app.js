const express = require('express');
const cors = require('cors');
const app = express();
const rutas = require('./rutas');

const reportestRouter = require('./backend/JS/reportest');

app.use(express.json());
app.use(cors());

app.use('/tecnico', reportestRouter);
app.use('/', rutas);

app.listen(3001, () => {
  console.log('Servidor corriendo en http://localhost:3001');
});