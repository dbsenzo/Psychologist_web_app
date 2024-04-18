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

app.get('/consultations', (req, res) => {
  var sql = 'SELECT Prenom, Nom, Sexe, Profession, Creneaux, Retard, Prix, ModeDeReglement, IndicateurAnxiete, NombreDePersonnes, Observations'
    + ' FROM patient INNER JOIN Consulter ON patient.IdPatient = consulter.IdPatient INNER JOIN Profession ON patient.IdProfession = profession.IdProfession INNER JOIN Calendrier ON consulter.IdCalendrier = calendrier.IdCalendrier';
    connection.query(sql, function (err, result) {
      console.log(result);
      if (err) {
        console.error('Erreur', err);
        res.status(500).send('Erreur lors de la récupération des consultations du patient');
        return;
      }
      res.send(result);
    });
});

// insérer une consultation
app.post('/consultations/add', (req, res) => {
  const { IdPatient, IdCalendrier, Retard, Prix, ModeDeReglement, IndicateurAnxiete, NombreDePersonnes, Observations } = req.body;
  const consultation = {
    IdPatient,
    IdCalendrier,
    Retard,
    Prix,
    ModeDeReglement,
    IndicateurAnxiete,
    NombreDePersonnes,
    Observations
  };

  const sql = 'INSERT INTO consulter (IdPatient, IdCalendrier, Retard, Prix, ModeDeReglement, IndicateurAnxiete, NombreDePersonnes, Observations) SET (?,?,?,?,?,?,?,?)';
  connection.query(sql, consultation, (err, result) => {
    if (err) {
      console.error('Erreur', err);
      res.status(500).send('Erreur lors de l\'insertion de la consultation');
      return;
    }
    res.send('Consultation insérée avec succès');
  });
});

app.put('/consultations/update/:id', (req, res) => {
  const { IdPatient, IdCalendrier, Retard, Prix, ModeDeReglement, IndicateurAnxiete, NombreDePersonnes, Observations } = req.body;
  const consultation = {
    IdPatient,
    IdCalendrier,
    Retard,
    Prix,
    ModeDeReglement,
    IndicateurAnxiete,
    NombreDePersonnes,
    Observations
  };

  const sql = "UPDATE consulter SET IdPatient=?, IdCalendrier=?, Retard=?, Prix=?, ModeDeReglement=?, IndicateurAnxiete=?, NombreDePersonnes=?, Observations=? WHERE IdCalendrier = ?, IdPatient = ?"
})

app.listen(3000, () => console.log('Example app is listening on port 3000.'));