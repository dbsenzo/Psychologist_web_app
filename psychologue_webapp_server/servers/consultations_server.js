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
  var idcal = uuidv4();
    req.connection.query('INSERT INTO calendrier(IdCalendrier, Creneaux) VALUES (?,?)', [idcal, DateCreneau], (err, result) => {
      if (err) {
        console.log('Erreur', err);
      }
    })
    const sql = 'INSERT INTO consulter (IdPatient, IdCalendrier, Prix, NombreDePersonnes) VALUES (?,?,?,?)';
    req.connection.query(sql, [IdPatient, idcal, Prix, NombreDePersonnes], (err, result) => {
    if (err) {
      console.error('Erreur', err);
      res.status(500).send({message: 'Erreur lors de l\'insertion de la consultation: ' + err.sqlMessage});
      return;
    }
    res.send({message: 'Créneau ajoutée avec succès'});
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
  var sql = "select concat(`psychologue`.`patient`.`Nom`,' ',substr(`psychologue`.`patient`.`Prenom`,1,1),'.') AS `title`,date_format(`psychologue`.`calendrier`.`Creneaux`,'%Y-%m-%dT%H:%i:%sZ') AS `start` from ((`psychologue`.`calendrier` join `psychologue`.`consulter` on(`psychologue`.`calendrier`.`IdCalendrier` = `psychologue`.`consulter`.`IdCalendrier`)) join `psychologue`.`patient` on(`psychologue`.`consulter`.`IdPatient` = `psychologue`.`patient`.`IdPatient`)) WHERE consulter.isFinished = 0";
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
  const { IdPatient, IdCalendrier, Retard, Prix, ModeDeReglement, IndicateurAnxiete, NombreDePersonnes, Observations } = req.body;
  const consultation = {
    IdPatient,
    IdCalendrier,
    Retard,
    Prix,
    ModeDeReglement,
    IndicateurAnxiete,
    NombreDePersonnes,
    Observations,
    IdCalendrier,
    IdPatient
  };

  const sql = "UPDATE consulter SET IdPatient=?, IdCalendrier=?, Retard=?, Prix=?, ModeDeReglement=?, IndicateurAnxiete=?, NombreDePersonnes=?, Observations=? WHERE IdCalendrier = ? AND IdPatient = ?"
  req.connection.query(sql, consultation, (err, result) => {
    if (err) {
      console.error('Erreur', err);
      res.status(500).send('Erreur lors de la modification de la consultation');
      return;
    }
    res.send('Consultation modifiée avec succès');
  });
});

router.delete('/delete/:id', (res, req) => {
  var sql = "DELETE FROM consulter WHERE IdCalendrier = ?";
  req.connection.query(sql, req.params.id, (err, result) => {
    if (err) {
      console.error('Erreur', err);
      res.status(500).send('Erreur lors de la suppression de la consultation');
      return;
    }
    res.send('Consultation supprimée');
  });
});

module.exports = router;