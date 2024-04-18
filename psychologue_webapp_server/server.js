const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10; 
const app = express();
const patientsRoutes = require('./servers/patient_server');
const authRoutes = require('./servers/auth_server');
const graphRoutes = require('./servers/graph_server');
const creneauxRoutes = require('./servers/creneaux_server');
const consultationsRoutes = require('./servers/consultations_server');

app.use(cors())
app.use(express.json());


var connection = mysql.createConnection({  
  host  :'localhost',
  user  :'root',
  password  :'',
  database: 'psychologue'
});

app.use((req, res, next) => {
  req.connection = connection;
  next();
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

app.use('/patients', patientsRoutes)
app.use('/auth', authRoutes)
app.use('/graph', graphRoutes)
app.use('/creneaux', creneauxRoutes)
app.use('/consultations', consultationsRoutes)

app.listen(3000, () => console.log('Example app is listening on port 3000.'));