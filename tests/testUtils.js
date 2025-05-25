const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

const generateTestId = () => Math.floor(Math.random() * 10000) + 1000;

const testPool = new Pool({
  user: 'postgres', 
  host: 'localhost',
  database: 'mashroomTest1', 
  password: 'pass123',
  port: 5434 
});

const generateTestUser = () => ({
  email: `test_${uuidv4()}@example.com`,
  ime: `Test_${uuidv4().substring(0, 8)}`,
  lozinka: 'test123',
});

const generateTestUnos = (userId, gljivaId, lokacijaId) => ({
  id_korisnik: userId,
  id_gljiva: gljivaId,
  id_lokacija: lokacijaId
});


async function clearTestDatabase() {
  const tables = ['Unos', 'Korisnik', 'Gljiva', 'Lokacija'];
  for (const table of tables) {
    await testPool.query(`DELETE FROM ${table}`);
  }
}

module.exports = {
  generateTestId,
  testPool,
  generateTestUser,
  generateTestUnos,
  clearTestDatabase
};