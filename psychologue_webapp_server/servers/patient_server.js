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

// GET

app.get('/patients', (req, res) => {
    var sql = 'SELECT Prenom, Nom, Adresse, MoyenDeConnaissance, Sexe, Profession, DateProfession FROM patient INNER JOIN profession ON patient.IdProfession = profession.IdProfession';
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

app.post('/patiens/add', (req, res) => {
    const { Prenom, Nom, Adresse, MoyenDeConnaissance, Sexe, Profession, DateProfession } = req.body;
    var sql = 'INSERT INTO patient (Prenom, Nom, Adresse, MoyenDeConnaissance, Sexe, IdProfession, DateProfession) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, [Prenom, Nom, Adresse, MoyenDeConnaissance, Sexe, Profession, DateProfession], function (err, result) {
      if (err) {
        console.error('Erreur', err);
        res.status(500).send('Erreur lors de l\'ajout du patient');
        return;
      }
      res.send({ message: 'Patient ajouté avec succès' });
    });
});

app.put('/patients/update/:id', (req, res) => {
    const { Prenom, Nom, Adresse, MoyenDeConnaissance, Sexe, Profession } = req.body;
    var sql = 'UPDATE patient SET Prenom = ?, Nom = ?, Adresse = ?, MoyenDeConnaissance = ?, Sexe = ?, IdProfession = ?, DateProfession = ? WHERE IdPatient = ?';
    connection.query(sql, [Prenom, Nom, Adresse, MoyenDeConnaissance, Sexe, Profession, req.params.id], function (err, result) {
        if (err) {
          console.error('Erreur', err);
          res.status(500).send('Erreur lors de la modification du patient');
          return;
        }
        res.send({ message: 'Patient modifié avec succès' });
    });
});

app.delete('/patients/delete/:id', (req, res) => {
    var sql = 'DELETE FROM patient WHERE IdPatient = ?';
    connection.query(sql, [req.params.id], function (err, result) {
        if (err) {
          console.error('Erreur', err);
          res.status(500).send('Erreur lors de la suppression du patient');
          return;
        }
        res.send({ message: 'Patient supprimé avec succès' });
    });
});

app.listen(3000, () => console.log('Example app is listening on port 3000.'));