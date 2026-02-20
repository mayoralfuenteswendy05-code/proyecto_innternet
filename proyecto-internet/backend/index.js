
const express = require('express');
const cors = require('cors');
//importacion de las rutas
const loginRoutes = require('./login');
const rolRoutes = require('./rol'); 
const servicioRoutes = require('./servicio');
const clientesRoutes = require('./registrarclientes');
const empleadoRoutes = require('./registroempleado');
const registroservicioRoutes = require('./registroservicio');
const pagosRoutes = require('./pagosc');
const reportestRoutes = require('./reportest');
const geocodingRoutes = require('./geocoding');



const app = express();


app.use(cors());            
app.use(express.json());  

app.use('/', geocodingRoutes);  

//rutas
app.use('/', rolRoutes);  
app.use('/', servicioRoutes);
app.use('/', empleadoRoutes);
app.use('/', clientesRoutes);
app.use('/', registroservicioRoutes);
app.use('/', loginRoutes);
app.use('/', pagosRoutes);
app.use('/', reportestRoutes);



app.get("/meses", (req, res) => {
  db.query("SELECT * FROM Meses", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});


app.listen(3001, () => {
  console.log(' Servidor backend corriendo en http://localhost:3001');
});