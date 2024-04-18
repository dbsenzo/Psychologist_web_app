const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10; 

const app = express();
app.use(cors())
app.use(express.json());


var connection = mysql.createConnection({  
  host  :'localhost',
  user  :'root',
  password  :'',
  database: 'psychologue'
});

connection.connect((err) => {
  if (err) {
      throw err;
  } else {
      console.log('MySQL connected!');
  }
});

app.get('/graph/resa', (req, res) => {
    var sql = 'SELECT (((SELECT COUNT(start) FROM resamoisactuel) * 100) / COUNT(start)) - 100 AS Pourcentage FROM resamoisprecedent;';
    connection.query(sql, function (err, result) {
      if (err) {
        console.error('Erreur', err);
        res.status(500).send('Erreur lors de la récupération des Creneaux');
        return;
      }
      res.send(result);
    });
  });
  
app.get('/graph/patient', (req, res) => {
    var sql = 'SELECT (((SELECT COUNT(IdPatient) FROM patientmoisactuel) * 100) / COUNT(IdPatient)) - 100 AS Pourcentage FROM patientmoisprecedent;';
    connection.query(sql, function (err, result) {
      if (err) {
        console.error('Erreur', err);
        res.status(500).send('Erreur lors de la récupération des Creneaux');
        return;
      }
      res.send(result);
    });
  });

app.listen(3000, () => console.log('Example app is listening on port 3000.'));