const { login, register } = require('../../../backend/controllers/authController');
const { testPool, generateTestUser, clearTestDatabase } = require('../../testUtils');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret';
  process.env.JWT_EXPIRATION = '1h';

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
});

beforeEach(async () => {
  await clearTestDatabase();
});

afterAll(async () => {
  await testPool.end();
});

describe('Auth Controller', () => {
  test('login should return token for valid credentials', async () => {
    const testUser = generateTestUser();
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(testUser.lozinka, salt);

    // Insert user with hashed password
    const insertResult = await testPool.query(
      `INSERT INTO Korisnik (email, lozinka, sol, ime, datum_registracije, uloga)
       VALUES ($1, $2, $3, $4, CURRENT_DATE, 'osnovni')
       RETURNING id_korisnik, ime`,
      [testUser.email, hashedPassword, salt, testUser.ime]
    );

    const req = {
      body: {
        email: testUser.email,
        lozinka: testUser.lozinka
      }
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await login(req, res);

    expect(res.status).not.toHaveBeenCalled(); // jer je uspješan login
    expect(res.json).toHaveBeenCalled();

    const response = res.json.mock.calls[0][0];
    expect(response).toBeDefined();
    expect(response.token).toBeDefined();

    expect(response.ime).toBe(testUser.ime);

    const decoded = jwt.verify(response.token, process.env.JWT_SECRET);
    expect(decoded.id).toBe(insertResult.rows[0].id_korisnik);
    expect(decoded.ime).toBe(testUser.ime);
  });

  test('login should fail if user does not exist', async () => {
    const req = {
      body: {
        email: 'nepostojeci@example.com',
        lozinka: 'nekaLozinka123'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Ne postoji korisnik s tim emailom'
    });
  });

  test('login should fail with incorrect password', async () => {
    const testUser = generateTestUser();
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('ispravnaLozinka', salt);

    await testPool.query(
      `INSERT INTO Korisnik (email, lozinka, sol, ime, datum_registracije, uloga)
       VALUES ($1, $2, $3, $4, CURRENT_DATE, 'osnovni')`,
      [testUser.email, hashedPassword, salt, testUser.ime]
    );

    const req = {
      body: {
        email: testUser.email,
        lozinka: 'pogresnaLozinka'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Netočna lozinka'
    });
  });
});