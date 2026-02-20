const mysql = require('mysql2');

const bd = mysql.createPool({
  host: 'localhost',         
  user: 'root',             
  password: '',      
  database: 'servicio_internet' 
});

module.exports = bd;
