const pool = require('../db');
const bcrypt = require('bcrypt');
const { register } = require('../controllers/authController');


module.exports = {
    async register(email, lozinka, ime){
        try{
            const userExists = await pool.query(
                'SELECT id_korisnik FROM Korisnik WHERE email = $1', 
                [email]
            );
            if (userExists.rows.length > 0){
                throw new Error('Email zauzet');
            }
            const salt = await bcrypt.genSalt(12);
            const hashedLozinka = await bcrypt.hash(lozinka, salt);

            const result = await pool.query(
                `INSERT INTO Korisnik (email, lozinka, sol, ime, datum_registracije, uloga)
                 VALUES ($1, $2, $3, $4, CURRENT_DATE, 'osnovni')
                 RETURNING id_korisnik, ime, email`,
                [email, hashedLozinka, salt, ime]
            );

            return result.rows[0];
        }
        catch (err){
            throw err;
        }
    },

    async login(email, lozinka){
        try{
            const result = await pool.query(
                'SELECT id_korisnik, email, lozinka, ime FROM Korisnik WHERE email = $1',
                [email]);

            if (result.rows.length === 0){
                throw new Error('Pogrešno unesen email');
            }
            const korisnik = result.rows[0];

            const match = await bcrypt.compare(lozinka, korisnik.lozinka);
            if (!match){
                throw new Error('Pogrešna lozinka');
            }
            return {
                id_korisnik: korisnik.id_korisnik,
                ime: korisnik.ime,
                mail: korisnik.email
            };
        }
        catch (err){
            throw err;
        }
    }

};