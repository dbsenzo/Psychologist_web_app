const express = require('express');
const router = express.Router();

router.get('/libres', (req, res) => {
    var sql = 'SELECT Creneaux FROM Calendrier WHERE IdCalendrier NOT IN (SELECT IdCalendrier FROM consulter)';
    req.connection.query(sql, function (err, result) {
      if (err) {
        console.error('Erreur', err);
        res.status(500).send('Erreur lors de la récupération des Creneaux libres');
        return;
      }
      res.send(result);
    });
});
  
router.get('/moisn-1', (req, res) => {
    var sql = "SELECT * FROM resamoisprecedent";
    req.connection.query(sql, function (err, result) {
      if (err) {
        console.error('Erreur', err);
        res.status(500).send('Erreur lors de la récupération des Creneaux du mois précédent');
        return;
      }
      res.send(result);
    });
});
  
router.get('/moisn', (req, res) => {
    var sql = "SELECT * FROM resamoisactuel";
    req.connection.query(sql, function (err, result) {
      if (err) {
        console.error('Erreur', err);
        res.status(500).send('Erreur lors de la récupération des Creneaux du mois en cours');
        return;
      }
      res.send(result);
    });
});
  
router.get('/all', (req, res) => {
    var sql = "SELECT * FROM allresa";
    req.connection.query(sql, function (err, result) {
      if (err) {
        console.error('Erreur', err);
        res.status(500).send('Erreur lors de la récupération des Creneaux');
        return;
      }
      res.send(result);
    });
});
  
router.get('/', (req, res) => {
    var sql = 'SELECT Creneaux FROM calendrier';
    req.connection.query(sql, function (err, result) {
      if (err) {
        console.error('Erreur', err);
        res.status(500).send('Erreur lors de la récupération des Creneaux');
        return;
      }
      res.send(result);
    });
});

router.post('/add', (req, res) => {
    const formData = req.body;
    console.log(formData);

    var sql = 'INSERT INTO calendrier SET ?';
    req.connection.query(sql, formData, function (err, result) {
      if (err) {
        console.error('Erreur', err);
        res.status(500).send('Erreur lors de l\'ajout du Creneau');
        return;
      }
      res.send({ message: 'Creneau ajouté avec succès' });
    });
});

router.put('/update/:id', (req, res) => {
    const idCreneau = req.params.id;
    const formData = req.body;
    console.log(formData);
    console.log(idCreneau);

    var sql = 'UPDATE calendrier SET ? WHERE IdCalendrier = ?';
    req.connection.query(sql, [formData, idCreneau], function (err, result) {
        if (err) {
          console.error('Erreur', err);
          res.status(500).send('Erreur lors de la modification du Creneau');
          return;
        }
        res.send({ message: 'Creneau modifié avec succès' });
    });
});

router.delete('/delete/:id', (req, res) => {
    const idCreneau = req.params.id;
    console.log(idCreneau);

    var sql = 'DELETE FROM calendrier WHERE IdCalendrier = ?';
    req.connection.query(sql, [idCreneau], function (err, result) {
        if (err) {
          console.error('Erreur', err);
          res.status(500).send('Erreur lors de la suppression du Creneau');
          return;
        }
        res.send({ message: 'Creneau supprimé avec succès' });
    });
});

module.exports = router;