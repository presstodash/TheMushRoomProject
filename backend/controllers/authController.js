const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    const { email, lozinka } = req.body;
  
    try {
        const rezultat = await pool.query(
            "SELECT id_korisnik, email, lozinka, ime FROM Korisnik WHERE email = $1",
            [email]
        );
    
        if (rezultat.rows.length === 0) {
            return res.status(401).json({ error: "Ne postoji korisnik s tim emailom" });
        }
    
        const korisnik = rezultat.rows[0];
    
        const isMatch = await bcrypt.compare(lozinka, korisnik.lozinka);
    
        if (!isMatch) {
            return res.status(401).json({ error: "Netočna lozinka" });
        }
    
        const token = jwt.sign(
            { id: korisnik.id_korisnik, ime: korisnik.ime },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION || "2h" }
        );

        return res.json({
            token,
            ime: korisnik.ime
        });
        } catch (err) {
            console.error("Greška u loginu:", err.message);
            res.status(500).json({ error: "Greška na serveru" });
        }
    };

  const register = async (req, res) => {
    const { email, ime, lozinka } = req.body;
  
    if (!email || !ime || !lozinka) {
      return res.status(400).json({ error: "Sva polja su obavezna" });
    }
  
    try {
        const postoji = await pool.query(
            "SELECT id_korisnik FROM Korisnik WHERE email = $1",
            [email]
        );
        if (postoji.rows.length > 0) {
            return res.status(409).json({ error: "Korisnik s tim emailom već postoji" });
        }
    
        const salt = await bcrypt.genSalt(12);
        const hashedLozinka = await bcrypt.hash(lozinka, salt);
    
        const rezultat = await pool.query(
            `INSERT INTO Korisnik (email, lozinka, sol, ime, datum_registracije, uloga)
            VALUES ($1, $2, $3, $4, CURRENT_DATE, 'osnovni')
            RETURNING id_korisnik, ime`,
            [email, hashedLozinka, salt, ime]
        );
    
        const noviKorisnik = rezultat.rows[0];
        const token = jwt.sign(
            { id: noviKorisnik.id_korisnik, ime: noviKorisnik.ime },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION || "2h" }
        );
    
        return res.status(201).json({
            token,
            ime: noviKorisnik.ime,
        });
    } catch (err) {
        console.error("Greška pri registraciji:", err.message);
        res.status(500).json({ error: "Greška na serveru" });
    }
  };

module.exports = { login, register };