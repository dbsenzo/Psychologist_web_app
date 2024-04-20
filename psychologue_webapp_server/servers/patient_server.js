const { v4: uuidv4 } = require('uuid');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const saltRounds = 10;

// GET
// GET
router.get('/', (req, res) => {
  var sql = 'SELECT IdPatient as id, Prenom, Nom, Adresse, MoyenDeConnaissance, Sexe, Profession, DateDeNaissance FROM patient INNER JOIN profession ON patient.IdProfession = profession.IdProfession';
  req.connection.query(sql, function (err, result) {
      if (err) {
          console.error('Erreur', err);
          res.status(500).send('Erreur lors de la récupération des patients.');
          return;
      }
      // Création d'un nouveau tableau pour stocker les résultats enrichis avec l'information d'âge
      var enrichedResults = result.map(patient => {
          var bday = new Date(patient.DateDeNaissance);
          var today = new Date();
          var diffAnnees = today.getFullYear() - bday.getFullYear();

          // Vérifier si l'anniversaire de la première date est déjà passé cette année
          if (today.getMonth() < bday.getMonth() || (today.getMonth() === bday.getMonth() && today.getDate() < bday.getDate())) {
              diffAnnees--;
          }
          var isMajor = diffAnnees >= 18;

          // Ajouter la propriété isMajor au patient
          return { ...patient, isMajor: isMajor };
      });

      // Envoyer le résultat enrichi
      res.send(enrichedResults);
  });
});


router.post('/add', (req, res) => {
  var idProf = uuidv4();
  var id = uuidv4();
  // format date de naissance si possible: MM-DD-YYYY :)
  const { prenom, nom, adresse, moyenDeConnaissance, sexe, dateNaissance, profession } = req.body;
  var sqlCompte = 'INSERT INTO accounts (username, pass, IdPatient, IsAdmin) VALUES (?, ?, ?, ?)';
  var sqlProf = 'INSERT INTO profession (IdProfession, Profession) VALUES (?, ?)';
  var sqlHisto = 'INSERT INTO historique_profession (IdPatient, IdProfession, DateChangement) VALUES (?, ?, ?)'
  var sql = 'INSERT INTO patient (IdPatient, Prenom, Nom, Adresse, MoyenDeConnaissance, Sexe, DateDeNaissance, IdProfession) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  var dateProfession = new Date();


  req.connection.query(sqlProf, [idProf, profession], function (err, result) {
    if (err) {
      console.error('Erreur', err);
      res.status(500).send('Erreur lors de l\'ajout de la profession ', err);
      return;
    }

    req.connection.query(sqlHisto, [id, idProf, dateProfession], function (err, result) {
      if (err) {
        console.error('Erreur', err);
        res.status(500).send('Erreur lors de l\'ajout de l\'historique de profession ', err);
        return;
      }
    });
  });

  req.connection.query(sql, [id, prenom, nom, adresse, moyenDeConnaissance, sexe, dateNaissance, idProf], function (err, result) {
    if (err) {
      console.error('Erreur', err);
      res.status(500).send('Erreur lors de l\'ajout du patient ', err);
      return;
    }
    res.send({ message: 'Patient ajouté avec succès' });
  });
  
  bcrypt.hash(nom + prenom, saltRounds, function(err, hashedPassword) {
    if (err) {
      console.error('Error hashing password', err);
      res.status(500).send('Error processing password');
      return;
    }
    req.connection.query(sqlCompte, [nom + prenom, hashedPassword, id, 0], function (err, result) {
      if (err) {
        console.error('Erreur', err);
        res.status(500).send('Erreur lors de l\'ajout du compte ', err);
        return;
      }
    });
  });
});

router.get('/:id', (req, res) => {
  var sql = 'SELECT IdPatient, Prenom, Nom, Adresse, MoyenDeConnaissance, Sexe, Profession FROM patient INNER JOIN profession ON patient.IdProfession = profession.IdProfession WHERE IdPatient = ?';
  req.connection.query(sql, [req.params.id], function (err, result) {
      if (err) {
        console.error('Erreur', err);
        res.status(500).send('Erreur lors de la récupération du patient.');
        return;
      }
      res.send(result);
    });
});

router.put('/update/:id', (req, res) => {
    const { Prenom, Nom, Adresse, MoyenDeConnaissance, Sexe, Profession, IdPatient } = req.body;
    
    console.log(req.body);

    if (Profession != null) {
      var idProf = uuidv4();
      var sqlProf = 'INSERT INTO Profession (IdProfession, Profession) VALUES (?, ?)';
      var dateProfession = new Date();
      req.connection.query(sqlProf, [idProf, Profession], function (err, result) {
        if (err) {
          console.error('Erreur', err);
          res.status(500).send('Erreur lors de la modification de la profession');
          return;
        }

        req.connection.query('INSERT INTO historique_profession (IdPatient, IdProfession, DateChangement) VALUES (?, ?, ?)', [IdPatient, idProf, dateProfession], function (err, result) {
          if (err) {
            console.error('Erreur', err);
            res.status(500).send('Erreur lors de la modification de la profession');
            return;
          }
      });
      });

      var sql = 'UPDATE patient SET Prenom = ?, Nom = ?, Adresse = ?, MoyenDeConnaissance = ?, Sexe = ?, IdProfession = ? WHERE IdPatient = ?';
      req.connection.query(sql, [Prenom, Nom, Adresse, MoyenDeConnaissance, Sexe, idProf, IdPatient ], function (err, result) {
        if (err) {
          console.error('Erreur', err);
          res.status(500).send('Erreur lors de la modification du patient');
          return;
        }
        res.send({ message: 'Patient et profession modifié avec succès' });
    });

    }else{
      var sql = 'UPDATE patient SET Prenom = ?, Nom = ?, Adresse = ?, MoyenDeConnaissance = ?, Sexe = ? WHERE IdPatient = ?';
      req.connection.query(sql, [Prenom, Nom, Adresse, MoyenDeConnaissance, Sexe, IdPatient ], function (err, result) {
        if (err) {
          console.error('Erreur', err);
          res.status(500).send('Erreur lors de la modification du patient');
          return;
        }
        res.send({ message: 'Patient modifié avec succès' });
    });
  }
});

router.delete('/delete/:id', (req, res) => {
  const patientId = req.params.id;

  // D'abord récupérer le IdProfession avant la suppression
  req.connection.query('SELECT IdProfession FROM patient WHERE IdPatient = ?', [patientId], function (err, results) {
      if (err) {
          console.error('Erreur lors de la récupération de la profession', err);
          res.status(500).send('Erreur lors de la récupération de la profession du patient');
          return;
      }
    });

      // Suppression du compte
      req.connection.query('DELETE FROM accounts WHERE IdPatient = ?', [patientId], function (err, result) {
          if (err) {
              console.error('Erreur', err);
              res.status(500).send('Erreur lors de la suppression du compte du patient');
              return;
          }
      });

      // Suppression des consultations
      req.connection.query('DELETE FROM consulter WHERE IdPatient = ?', [patientId], function (err, result) {
          if (err) {
              console.error('Erreur', err);
              res.status(500).send('Erreur lors de la suppression des consultations du patient');
              return;
          }
      });

      // Suppression de l'historique de profession
      req.connection.query('DELETE FROM historique_profession WHERE IdPatient = ?', [patientId], function (err, result) {
        if (err) {
            console.error('Erreur', err);
            res.status(500).send('Erreur lors de la suppression de la profession du patient');
            return;
        }
    });

      // Suppression du patient
      req.connection.query('DELETE FROM patient WHERE IdPatient = ?', [patientId], function (err, result) {
          if (err) {
              console.error('Erreur', err);
              res.status(500).send('Erreur lors de la suppression du patient');
              return;
          }
          res.send({ message: 'Patient supprimé avec succès' });
        });
});


module.exports = router;