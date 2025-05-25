const { create, checkDuplicates } = require('../../../backend/models/unosModel');
const { testPool, generateTestUser, generateTestUnos, clearTestDatabase } = require('../../testUtils');

beforeEach(async () => {
  await clearTestDatabase();

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
      id_gljiva INT NOT NULL,
      id_lokacija INT NOT NULL,
      id_korisnik INT NOT NULL,
      datum_unosa TIMESTAMP DEFAULT NOW(),
      FOREIGN KEY (id_gljiva) REFERENCES Gljiva(id_gljiva),
      FOREIGN KEY (id_lokacija) REFERENCES Lokacija(id_lokacija),
      FOREIGN KEY (id_korisnik) REFERENCES Korisnik(id_korisnik)
    )`
  );

  await testPool.query(`
    INSERT INTO Korisnik (id_korisnik, email, lozinka, sol, ime, datum_registracije, uloga)
    VALUES (1, 'test@example.com', 'hash', 'salt', 'Test', CURRENT_DATE, 'osnovni')
  `);
  
  await testPool.query(`
    INSERT INTO Gljiva (id_gljiva, latinski_naziv, hrvatski_naziv, jestiva, opis, slika)
    VALUES (1, 'Test', 'Test', true, 'Test', 'test.jpg')
  `);
  
  await testPool.query(`
    INSERT INTO Lokacija (id_lokacija, naziv_lokacije, geo_sirina, geo_duljina, regija)
    VALUES (1, 'Test', 0, 0, 'Test')
  `);
});

describe('Unos Model', () => {
  describe('create', () => {
    it('should create new unos', async () => {
      const unosData = generateTestUnos(1, 1, 1);
      const result = await create(unosData);
      expect(result).toBeDefined();
    });

    it('should prevent duplicates for same day', async () => {
    const unosData = generateTestUnos(1, 1, 1);
    await create(unosData);
    await expect(create(unosData))
        .rejects
        .toThrow('Već ste unijeli ovu vrstu gljive, na ovoj lokaciji, danas');
});

  describe('checkDuplicates', () => {
    it('should return false for non-duplicate', async () => {
      const hasDuplicate = await checkDuplicates(1, 1, 1);
      expect(hasDuplicate).toBe(false);
    });
  });
});
})
