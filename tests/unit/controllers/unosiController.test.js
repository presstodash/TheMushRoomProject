const { getSviUnosi } = require('../../../backend/controllers/unosiController');
const { testPool , clearTestDatabase, generateTestUser, generateTestId} = require('../../testUtils');
const bcrypt = require('bcrypt');

describe('Unosi Controller', () => {
    let testUserId;

    beforeAll(async () => {
        await clearTestDatabase();
        
        // Generate test data with unique IDs
        testUserId = Math.floor(Math.random() * 10000) + 1000;
        const testUser = generateTestUser();

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
                FOREIGN KEY (id_gljiva) REFERENCES Gljiva(id_gljiva),
                FOREIGN KEY (id_lokacija) REFERENCES Lokacija(id_lokacija),
                FOREIGN KEY (id_korisnik) REFERENCES Korisnik(id_korisnik)
            )`
        );

        // Insert test data
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(testUser.lozinka, salt);

        await testPool.query(
            `INSERT INTO Korisnik (id_korisnik, email, lozinka, sol, ime, datum_registracije, uloga)
             VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, 'osnovni')`,
            [testUserId, testUser.email, hashedPassword, salt, testUser.ime]
        );

        await testPool.query(
            `INSERT INTO Gljiva (id_gljiva, latinski_naziv, hrvatski_naziv, jestiva, opis, slika)
             VALUES (2, 'Test Gljiva', 'Test Gljiva', true, 'Test opis', 'test.jpg')`
        );

        await testPool.query(
            `INSERT INTO Lokacija (id_lokacija, naziv_lokacije, geo_sirina, geo_duljina, regija)
             VALUES (2, 'Test Lokacija', 45.0, 15.0, 'Test Regija')`,
        );
    });

    afterAll(async () => {
        await clearTestDatabase();
        await testPool.end();
    });

    test('getSviUnosi should return unosi', async () => {
        // First create a test entry
        await testPool.query(
            `INSERT INTO Unos (id_gljiva, id_lokacija, id_korisnik)
             VALUES (2, 2, $1)`,
            [testUserId]
        );

        const req = { 
            korisnik: { id: testUserId },
            query: {} 
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getSviUnosi(req, res);
        
        expect(res.status).not.toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalled();
        expect(res.json.mock.calls[0][0].length).toBeGreaterThan(0);
    });
});