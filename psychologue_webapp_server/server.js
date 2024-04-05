const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors())


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

app.get('/', (req, res) => {
  res.send('Successful response.');
});

app.get('/patients', (req, res) => {
    var sql = 'SELECT IdPatient, Prenom, Nom, Adresse, MoyenDeConnaissance, Sexe, Profession, DateProfession FROM patient INNER JOIN profession ON patient.IdProfession = profession.IdProfession';
    connection.query(sql, function (err, result) {
        if (err) {
          console.error('Erreur', err);
          res.status(500).send('Erreur lors de la récupération des patients.');
          return;
        }
        res.send(result);
    });
});

app.get('/patients/:id', (req, res) => {
  var sql = 'SELECT IdPatient, Prenom, Nom, Adresse, MoyenDeConnaissance, Sexe, Profession, DateProfession FROM patient INNER JOIN profession ON patient.IdProfession = profession.IdProfession WHERE IdPatient = ?';
  connection.query(sql, [req.params.id], function (err, result) {
      if (err) {
        console.error('Erreur', err);
        res.status(500).send('Erreur lors de la récupération du patient.');
        return;
      }
      res.send(result);
  });
});
app.get('/consultations', (req, res) => {
  var sql = 'SELECT idPatient, Prenom, Nom, Sexe, Profession, Creneaux, Retard, Prix, ModeDeReglement, IndicateurAnxiete, NombreDePersonnes, Observations'
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

app.get('/creneaux/libres', (req, res) => {
  var sql = 'SELECT Creneaux FROM Calendrier WHERE IdCalendrier NOT IN (SELECT IdCalendrier FROM consulter)';
  connection.query(sql, function (err, result) {
    if (err) {
      console.error('Erreur', err);
      res.status(500).send('Erreur lors de la récupération des Creneaux libres');
      return;
    }
    res.send(result);
  });
});

app.get('/creneaux/moisn-1', (req, res) => {
  var sql = "SELECT CONCAT(patient.Nom,' ', SUBSTRING(patient.Prenom,1,1), '.') AS Titre, Creneaux FROM calendrier INNER JOIN consulter ON calendrier.IdCalendrier = consulter.IdCalendrier INNER JOIN patient ON consulter.IdPatient = patient.IdPatient WHERE MONTH(calendrier.Creneaux) = MONTH(CURRENT_DATE)-1;";
  connection.query(sql, function (err, result) {
    if (err) {
      console.error('Erreur', err);
      res.status(500).send('Erreur lors de la récupération des Creneaux du mois précédent');
      return;
    }
    res.send(result);
  });
});

app.get('/creneaux/moisn', (req, res) => {
  var sql = "SELECT CONCAT(patient.Nom,' ', SUBSTRING(patient.Prenom,1,1), '.') AS Titre, Creneaux FROM calendrier INNER JOIN consulter ON calendrier.IdCalendrier = consulter.IdCalendrier INNER JOIN patient ON consulter.IdPatient = patient.IdPatient WHERE MONTH(calendrier.Creneaux) = MONTH(CURRENT_DATE);";
  connection.query(sql, function (err, result) {
    if (err) {
      console.error('Erreur', err);
      res.status(500).send('Erreur lors de la récupération des Creneaux du mois en cours');
      return;
    }
    res.send(result);
  });
});

app.get('/creneaux', (req, res) => {
  var sql = 'SELECT Creneaux FROM calendrier';
  connection.query(sql, function (err, result) {
    if (err) {
      console.error('Erreur', err);
      res.status(500).send('Erreur lors de la récupération des Creneaux');
      return;
    }
    res.send(result);
  });
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




app.listen(3000, () => console.log('Example app is listening on port 3000.'));