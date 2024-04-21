const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

router.get('/', (req, res) => {
  var sql = 'SELECT Prenom, Nom, Sexe, Profession, Creneaux, Retard, Prix, ModeDeReglement, IndicateurAnxiete, NombreDePersonnes, Observations'
    + ' FROM patient INNER JOIN Consulter ON patient.IdPatient = consulter.IdPatient INNER JOIN Profession ON patient.IdProfession = profession.IdProfession INNER JOIN Calendrier ON consulter.IdCalendrier = calendrier.IdCalendrier';
    req.connection.query(sql, function (err, result) {
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
router.post('/add', (req, res) => {
  const { IdPatient, DateCreneau, Prix, NombreDePersonnes } = req.body;
  const idCal = uuidv4();

  // Commencer une transaction
  req.connection.beginTransaction(err => {
      if (err) {
          console.error('Erreur lors du démarrage de la transaction:', err);
          return res.status(500).send({ message: 'Erreur lors du démarrage de la transaction: ' + err.sqlMessage });
      }

      // Première insertion dans la table 'calendrier'
      req.connection.query('INSERT INTO calendrier (IdCalendrier, Creneaux) VALUES (?, ?)', [idCal, DateCreneau], (err, result) => {
          if (err) {
              console.error('Erreur lors de l\'insertion dans calendrier:', err);
              return req.connection.rollback(() => {
                  res.status(500).send({ message: 'Erreur lors de l\'insertion dans le calendrier: ' + err.sqlMessage });
              });
          }

          // Deuxième insertion dans la table 'consulter'
          const sql = 'INSERT INTO consulter (IdPatient, IdCalendrier, Prix, NombreDePersonnes) VALUES (?, ?, ?, ?)';
          req.connection.query(sql, [IdPatient, idCal, Prix, NombreDePersonnes], (err, result) => {
              if (err) {
                  console.error('Erreur lors de l\'insertion dans consulter:', err);
                  return req.connection.rollback(() => {
                      res.status(500).send({ message: 'Erreur lors de l\'insertion de la consultation: ' + err.sqlMessage });
                  });
              }

              // Valider la transaction
              req.connection.commit(err => {
                  if (err) {
                      console.error('Erreur lors de la validation de la transaction:', err);
                      return req.connection.rollback(() => {
                          res.status(500).send({ message: 'Erreur lors de la validation de la transaction: ' + err.sqlMessage });
                      });
                  }
                  res.send({ message: 'Créneau ajouté avec succès' });
              });
          });
      });
  });
});


router.get('/finis', (req, res) => {
  var sql = "select concat(`psychologue`.`patient`.`Nom`,' ',substr(`psychologue`.`patient`.`Prenom`,1,1),'.') AS `title`,date_format(`psychologue`.`calendrier`.`Creneaux`,'%Y-%m-%dT%H:%i:%sZ') AS `start` from ((`psychologue`.`calendrier` join `psychologue`.`consulter` on(`psychologue`.`calendrier`.`IdCalendrier` = `psychologue`.`consulter`.`IdCalendrier`)) join `psychologue`.`patient` on(`psychologue`.`consulter`.`IdPatient` = `psychologue`.`patient`.`IdPatient`)) WHERE consulter.isFinished = 1";
  req.connection.query(sql, (err, result) => {
    if (err) {
      console.error("Erreur", err);
      res.status(500).send("Erreur lors de la récupération des consultations");
      return;
    }
    res.send(result);
  });
});

router.get('/nonfinis', (req, res) => {
  var sql = "select consulter.IdCalendrier, consulter.IdPatient, concat(`psychologue`.`patient`.`Nom`,' ',substr(`psychologue`.`patient`.`Prenom`,1,1),'.') AS `title`,date_format(`psychologue`.`calendrier`.`Creneaux`,'%Y-%m-%dT%H:%i:%sZ') AS `start`, consulter.NombreDePersonnes from ((`psychologue`.`calendrier` join `psychologue`.`consulter` on(`psychologue`.`calendrier`.`IdCalendrier` = `psychologue`.`consulter`.`IdCalendrier`)) join `psychologue`.`patient` on(`psychologue`.`consulter`.`IdPatient` = `psychologue`.`patient`.`IdPatient`)) WHERE consulter.isFinished = 0";
  req.connection.query(sql, (err, result) => {
    if (err) {
      console.error("Erreur", err);
      res.status(500).send("Erreur lors de la récupération des consultations");
      return;
    }
    res.send(result);
  });
});

router.get('/finish/:id', (req, res) => {
  const { Retard, ModeDeReglement, IndicateurAnxiete, Observations } = req.body;
  var sql = "UPDATE consulter SET isFinished = 1, Retard = ?, ModeDeReglement = ?, IndicateurAnxiete = ?, Observations = ? WHERE IdCalendrier = ?";
  req.connection.query(sql, [Retard, ModeDeReglement, IndicateurAnxiete, Observations, req.params.id], (err, result) => {
    if (err) {
      console.error('Erreur', err);
      res.status(500).send('Erreur lors de la fin de la consultation');
      return;
    }
    res.send('Consultation terminée');
  });
});

router.put('/update/:id', (req, res) => {
  const { idPatient, IdCalendrier, NombreDePersonnes, DateCreneau } = req.body;
  console.log(req);
  // Updating the calendrier table
  var sqlCr = "UPDATE calendrier SET Creneaux = ? WHERE IdCalendrier = ?";
  req.connection.query(sqlCr, [DateCreneau, IdCalendrier], (err, result) => {
      if (err) {
          console.error('Erreur updating calendrier:', err);
          res.status(500).send("Erreur lors de la modification du créneau");
          return;
      }
      // If calendrier update succeeds, then update consulter
      const sql = "UPDATE consulter SET IdPatient = ?, NombreDePersonnes = ? WHERE IdCalendrier = ?";
      req.connection.query(sql, [idPatient, NombreDePersonnes, IdCalendrier], (err, result) => {
          if (err) {
              console.error('Erreur updating consulter:', err);
              res.status(500).send('Erreur lors de la modification de la consultation');
              return;
          }
          res.send({ message: 'Consultation modifiée avec succès' });
      });
  });
});


router.delete('/delete/:idCalendrier', (req, res) => {
  const { idCalendrier } = req.params;
  const sqlDeleteConsultation = "DELETE FROM consulter WHERE IdCalendrier = ?";
  const sqlDeleteCreneau = "DELETE FROM calendrier WHERE IdCalendrier = ?";

  // First delete consultation details
  req.connection.query(sqlDeleteConsultation, [idCalendrier], (err, result) => {
      if (err) {
          console.error('Erreur', err);
          return res.status(500).send('Erreur lors de la suppression de la consultation');
      }

      // Then delete the calendar slot
      req.connection.query(sqlDeleteCreneau, [idCalendrier], (err, result) => {
          if (err){
              console.error('Erreur', err);
              return res.status(500).send('Erreur lors de la suppression du créneau');
          }
          res.send({message: "Créneau et consultation supprimés avec succès"});
      });
  });
});


module.exports = router;