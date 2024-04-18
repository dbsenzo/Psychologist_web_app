const express = require('express');
const router = express.Router();

router.get('/resa', (req, res) => {
    var sql = 'SELECT (((SELECT COUNT(start) FROM resamoisactuel) * 100) / COUNT(start)) - 100 AS Pourcentage FROM resamoisprecedent;';
    req.connection.query(sql, function (err, result) {
      if (err) {
        console.error('Erreur', err);
        res.status(500).send('Erreur lors de la récupération des Creneaux');
        return;
      }
      res.send(result);
    });
  });
  
router.get('/patient', (req, res) => {
    var sql = 'SELECT (((SELECT COUNT(IdPatient) FROM patientmoisactuel) * 100) / COUNT(IdPatient)) - 100 AS Pourcentage FROM patientmoisprecedent;';
    req.connection.query(sql, function (err, result) {
      if (err) {
        console.error('Erreur', err);
        res.status(500).send('Erreur lors de la récupération des Creneaux');
        return;
      }
      res.send(result);
    });
});

module.exports = router;