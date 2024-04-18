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
    var sql = "SELECT * FROM resamoisprecedent";
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
    var sql = "SELECT * FROM resamoisactuel";
    connection.query(sql, function (err, result) {
      if (err) {
        console.error('Erreur', err);
        res.status(500).send('Erreur lors de la récupération des Creneaux du mois en cours');
        return;
      }
      res.send(result);
    });
});
  
app.get('/creneaux/all', (req, res) => {
    var sql = "SELECT * FROM allresa";
    connection.query(sql, function (err, result) {
      if (err) {
        console.error('Erreur', err);
        res.status(500).send('Erreur lors de la récupération des Creneaux');
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

app.post('/creneaux/add', (req, res) => {
    const formData = req.body;
    console.log(formData);

    var sql = 'INSERT INTO calendrier SET ?';
    connection.query(sql, formData, function (err, result) {
      if (err) {
        console.error('Erreur', err);
        res.status(500).send('Erreur lors de l\'ajout du Creneau');
        return;
      }
      res.send({ message: 'Creneau ajouté avec succès' });
    });
});

app.put('/creneaux/update/:id', (req, res) => {
    const idCreneau = req.params.id;
    const formData = req.body;
    console.log(formData);
    console.log(idCreneau);

    var sql = 'UPDATE calendrier SET ? WHERE IdCalendrier = ?';
    connection.query(sql, [formData, idCreneau], function (err, result) {
        if (err) {
          console.error('Erreur', err);
          res.status(500).send('Erreur lors de la modification du Creneau');
          return;
        }
        res.send({ message: 'Creneau modifié avec succès' });
    });
});

app.delete('/creneaux/delete/:id', (req, res) => {
    const idCreneau = req.params.id;
    console.log(idCreneau);

    var sql = 'DELETE FROM calendrier WHERE IdCalendrier = ?';
    connection.query(sql, [idCreneau], function (err, result) {
        if (err) {
          console.error('Erreur', err);
          res.status(500).send('Erreur lors de la suppression du Creneau');
          return;
        }
        res.send({ message: 'Creneau supprimé avec succès' });
    });
});

app.listen(3000, () => console.log('Example app is listening on port 3000.'));