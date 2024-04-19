const { v4: uuidv4 } = require('uuid');
const express = require('express');
const router = express.Router();

// GET
router.get('/', (req, res) => {
    var sql = 'SELECT Prenom, Nom, Adresse, MoyenDeConnaissance, Sexe, Profession, DateProfession FROM patient INNER JOIN profession ON patient.IdProfession = profession.IdProfession';
    req.connection.query(sql, function (err, result) {
        if (err) {
            console.error('Erreur', err);
            res.status(500).send('Erreur lors de la récupération des patients.');
            return;
        }
        res.send(result);
    });
});

router.get('/:id', (req, res) => {
    var sql = 'SELECT IdPatient, Prenom, Nom, Adresse, MoyenDeConnaissance, Sexe, Profession, DateProfession FROM patient INNER JOIN profession ON patient.IdProfession = profession.IdProfession WHERE IdPatient = ?';
    req.connection.query(sql, [req.params.id], function (err, result) {
        if (err) {
          console.error('Erreur', err);
          res.status(500).send('Erreur lors de la récupération du patient.');
          return;
        }
        res.send(result);
    });
});

router.post('/add', (req, res) => {
  var idProf = uuidv4();
  var id = uuidv4();
  const { prenom, nom, adresse, moyenDeConnaissance, sexe, profession } = req.body;
  var sqlCompte = 'INSERT INTO accounts (username, pass, IdPatient, IsAdmin) VALUES (?, ?, ?, ?)';
  var sqlProf = 'INSERT INTO profession (IdProfession, Profession, DateProfession) VALUES (?, ?, ?)';
  var sql = 'INSERT INTO patient (IdPatient, Prenom, Nom, Adresse, MoyenDeConnaissance, Sexe, IdProfession) VALUES (?, ?, ?, ?, ?, ?, ?)';
  var dateProfession = new Date();


  req.connection.query(sqlProf, [idProf, profession, dateProfession], function (err, result) {
    if (err) {
      console.error('Erreur', err);
      res.status(500).send('Erreur lors de l\'ajout de la profession ', err);
      return;
    }
  });

  req.connection.query(sql, [id, prenom, nom, adresse, moyenDeConnaissance, sexe, idProf], function (err, result) {
    if (err) {
      console.error('Erreur', err);
      res.status(500).send('Erreur lors de l\'ajout du patient ', err);
      return;
    }
    res.send({ message: 'Patient ajouté avec succès' });
  });
  
  req.connection.query(sqlCompte, [nom + prenom, nom + prenom , id, 0], function (err, result) {
    if (err) {
      console.error('Erreur', err);
      res.status(500).send('Erreur lors de l\'ajout du compte ', err);
      return;
    }
  });


});


router.put('/update/:id', (req, res) => {
    const { Prenom, Nom, Adresse, MoyenDeConnaissance, Sexe, Profession, IdPatient } = req.body;

    if (Profession != null) {
      var idProf = uuidv4();
      var sqlProf = 'INSERT INTO Profession (IdProfession, Profession, DateProfession) VALUES (?, ?, ?)';
      var dateProfession = new Date();
      req.connection.query(sqlProf, [idProf, Profession, dateProfession], function (err, result) {
        if (err) {
          console.error('Erreur', err);
          res.status(500).send('Erreur lors de la modification de la profession');
          return;
        }
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
    var sql = 'DELETE FROM patient WHERE IdPatient = ?';
    var sqlAcc = 'DELETE FROM account WHERE IdPatient = ?';
    var sqlProf = 'DELETE FROM profession WHERE IdPatient = ?'

    req.connection.query(sqlAcc, [req.params.id], function (err, result) {
      if (err) {
        console.error('Erreur', err);
        res.status(500).send('Erreur lors de la suppression du patient');
        return;
      }
    });

    req.connection.query(sqlProf, [req.params.id], function (err, result) {
      if (err) {
        console.error('Erreur', err);
        res.status(500).send('Erreur lors de la suppression du patient');
        return;
      }
    });
    
    req.connection.query(sql, [req.params.id], function (err, result) {
        if (err) {
          console.error('Erreur', err);
          res.status(500).send('Erreur lors de la suppression du patient');
          return;
        }
        res.send({ message: 'Patient supprimé avec succès' });
    });
});

module.exports = router;