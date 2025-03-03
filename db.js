const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_username', // Sostituisci con il tuo nome utente MySQL
  password: 'your_password', // Sostituisci con la tua password MySQL
  database: 'nome_database' // Sostituisci con il nome del tuo database
});

module.exports = pool.promise();
