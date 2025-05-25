const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

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

const authRoute = require("./routes/auth");
app.use("/api/auth", authRoute);

const lokacijeRoute = require('./routes/lokacije');
app.use('/api/lokacije', lokacijeRoute);

app.get('/', (req, res) => {
  res.send('API working');
});


if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server working on port: ${PORT}`);
  });
}