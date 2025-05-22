const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const gljiveRoute = require('./routes/gljive');
app.use('/api/gljive', gljiveRoute);

const unosiRoute = require('./routes/unosi');
app.use('/api/unosi', unosiRoute);

app.get('/', (req, res) => {
  res.send('API working');
});

app.listen(PORT, () => {
  console.log(`Server working on port: ${PORT}`);
});