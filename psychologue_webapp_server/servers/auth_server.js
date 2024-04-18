const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
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

router.post('/signup', (req, res) => {
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

module.exports = router;