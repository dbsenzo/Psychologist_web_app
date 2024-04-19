const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const secretKey = 'sercret_very_secret';
const saltRounds = 10;

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Query to find the user by username only
  req.connection.query('SELECT * FROM accounts WHERE username = ?', [username], function (err, results) {
    if (err) {
      console.error('Error', err);
      res.status(500).send('Error during the connection');
      return;
    }
    if (results.length === 0) {
      res.status(401).send('User not found');
      return;
    }
    const user = results[0];
    // Compare password with hashed password stored in the database
    bcrypt.compare(password, user.pass, function(err, isMatch) {
      if (err) {
        console.log(err)
        res.status(500).send('Authentication error');
        return;
      }
      if (!isMatch) {
        res.status(401).send('Invalid credentials');
        return;
      }
      // If credentials are correct, create a JWT
      const token = jwt.sign({ id: user.IdPatient, username: user.username, isAdmin: user.isAdmin }, secretKey, { expiresIn: '1h' });
      res.send({ message: 'Login successful', token: token });
    });
  });
});

// Signup route
router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  // First, check if the user already exists
  req.connection.query('SELECT username FROM accounts WHERE username = ?', [username], function (err, results) {
    if (err) {
      console.error('Error checking user existence', err);
      res.status(500).send('Error during signup process');
      return;
    }
    if (results.length > 0) {
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

      req.connection.query('INSERT INTO accounts (username, pass, idPatient, isAdmin) VALUES (?, ?, ?, ?)', [username, hashedPassword, 1, 0], function (err, result) {
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
