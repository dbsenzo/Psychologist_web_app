const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
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
router.post('/add', (req, res) => {
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
  connection.query(sql, consultation, (err, result) => {
    if (err) {
      console.error('Erreur', err);
      res.status(500).send('Erreur lors de la modification de la consultation');
      return;
    }
    res.send('Consultation modifiée avec succès');
  });
});

router.delete('/:id', (res, req) => {
  var sql = "DELETE FROM consulter WHERE IdPatient = ?, IdCalendrier = ?"
});

module.exports = router;