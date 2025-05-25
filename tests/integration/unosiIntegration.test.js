const request = require('supertest');
const app = require('../../backend/server');
const { testPool, generateTestUser, clearTestDatabase } = require('../testUtils');
const bcrypt = require('bcrypt');



describe('Unosi Integration', () => {
  let authToken;
  let testUser;

  beforeAll(async () => {
    await clearTestDatabase();
    
    // Create test tables
    await testPool.query(`
      CREATE TABLE IF NOT EXISTS Korisnik (
        id_korisnik SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        lozinka VARCHAR(128) NOT NULL,
        sol VARCHAR(32) NOT NULL,
        ime VARCHAR(100) NOT NULL,
        datum_registracije DATE NOT NULL,
        uloga VARCHAR(64) NOT NULL
      )`
    );
    
    await testPool.query(`
      CREATE TABLE IF NOT EXISTS Gljiva (
        id_gljiva SERIAL PRIMARY KEY,
        latinski_naziv VARCHAR(255) NOT NULL,
        hrvatski_naziv VARCHAR(255) NOT NULL,
        jestiva BOOLEAN NOT NULL,
        opis TEXT NOT NULL,
        slika VARCHAR(2048) NOT NULL
      )`
    );
    
    await testPool.query(`
      CREATE TABLE IF NOT EXISTS Lokacija (
        id_lokacija SERIAL PRIMARY KEY,
        naziv_lokacije VARCHAR(255) NOT NULL,
        geo_sirina DECIMAL(9,6) NOT NULL,
        geo_duljina DECIMAL(9,6) NOT NULL,
        regija VARCHAR(128) NOT NULL
      )`
    );
    
await testPool.query(`
  CREATE TABLE IF NOT EXISTS Unos (
    id_unos SERIAL PRIMARY KEY,
    id_gljiva INT NOT NULL REFERENCES Gljiva(id_gljiva),
    id_lokacija INT NOT NULL REFERENCES Lokacija(id_lokacija),
    id_korisnik INT NOT NULL REFERENCES Korisnik(id_korisnik)
  );
`);
  

    // Insert test data
    testUser = generateTestUser();
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(testUser.lozinka, salt);
    
    await testPool.query(
      `INSERT INTO Korisnik (email, lozinka, sol, ime, datum_registracije, uloga)
       VALUES ($1, $2, $3, $4, CURRENT_DATE, 'osnovni')`,
      [testUser.email, hashedPassword, salt, testUser.ime]
    );
    
    await testPool.query(
      `INSERT INTO Gljiva (id_gljiva, latinski_naziv, hrvatski_naziv, jestiva, opis, slika)
       VALUES (2, 'Test', 'Test', true, 'Test', 'test.jpg')`
    );
    
    await testPool.query(
      `INSERT INTO Lokacija (id_lokacija, naziv_lokacije, geo_sirina, geo_duljina, regija)
       VALUES (3, 'Test', 0, 0, 'Test')`
    );

    // Login to get token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        lozinka: testUser.lozinka
      });
    
    authToken = loginRes.body.token;
  });

  test('should create and retrieve unosi', async () => {
    const createRes = await request(app)
      .post('/api/unosi')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        id_gljiva: 2,
        id_lokacija: 3
      });
    
    expect(createRes.statusCode).toBe(201);

    const getRes = await request(app)
      .get('/api/unosi')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.length).toBe(1);
  });
});