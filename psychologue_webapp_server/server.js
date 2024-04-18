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

app.get('/', (req, res) => {
  res.send('Successful response.');
});

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

app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  // Query to find the user by username only
  var sql = 'SELECT * FROM accounts WHERE username = ?';
  connection.query(sql, [username], function (err, result) {
    if (err) {
      console.error('Error', err);
      res.status(500).send('Error during the connection');
      return;
    }
    if (result.length === 0) {
      res.status(401).send('User not found');
      return;
    }
    // Compare password with hashed password stored in the database
    bcrypt.compare(password, result[0].password, function(err, isMatch) {
      if (err) {
        res.status(500).send('Authentication error');
        return;
      }
      if (!isMatch) {
        res.status(401).send('Invalid credentials');
        return;
      }
      // Send a success message or token etc. Never send the password back!
      res.send({ message: 'Login successful' });
    });
  });
});

app.post('/auth/signup', (req, res) => {
  const { username, password } = req.body;
  // First, check if the user already exists
  var sqlCheck = 'SELECT username FROM accounts WHERE username = ?';
  connection.query(sqlCheck, [username], function (err, result) {
    if (err) {
      console.error('Error checking user existence', err);
      res.status(500).send('Error during signup process');
      return;
    }
    if (result.length > 0) {
      res.status(409).send('User already exists');
      return;
    }

    // Hash password and store user in DB if user does not exist
    bcrypt.hash(password, saltRounds, function(err, hashedPassword) {
      if (err) {
        console.error('Error hashing password', err);
        res.status(500).send('Error processing password');
        return;
      }

      var sqlInsert = 'INSERT INTO accounts (username, password) VALUES (?, ?)';
      connection.query(sqlInsert, [username, hashedPassword], function (err, result) {
        if (err) {
          console.error('Error inserting user', err);
          res.status(500).send('Error during signup process');
          return;
        }
        res.send({ message: 'User registered successfully' });
      });
    });
  });
});


app.listen(3000, () => console.log('Example app is listening on port 3000.'));