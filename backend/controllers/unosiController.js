const pool = require('../db');

const kreirajUnos = async (req, res) => {
    const { id_gljiva, id_lokacija } = req.body;
    const id_korisnik = req.korisnik.id;

    try {
        const result = await pool.query(
            `INSERT INTO Unos (id_gljiva, id_korisnik, id_lokacija)
             VALUES ($1, $2, $3) RETURNING id_unos`,
            [id_gljiva, id_korisnik, id_lokacija]
        );

        res.status(201).json({ poruka: 'Unos dodan', id_unos: result.rows[0].id_unos });
    } catch (err) {
        console.error(err);
        res.status(500).json({ poruka: 'Greška pri unosu' });
    }
};

const getSviUnosi = async (req, res) => {
    const id_korisnik = req.korisnik.id;
  
    try {
        const result = await pool.query(
            `SELECT 
            u.id_unos, 
            g.hrvatski_naziv, 
            g.latinski_naziv, 
            g.slika, 
            l.naziv_lokacije AS lokacija
            FROM Unos u
            JOIN Gljiva g ON u.id_gljiva = g.id_gljiva
            JOIN Lokacija l ON u.id_lokacija = l.id_lokacija
            WHERE u.id_korisnik = $1
            ORDER BY u.id_unos DESC`,
            [id_korisnik]
        );
  
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ poruka: 'Greška pri dohvaćanju unosa' });
    }
};

const getJedanUnos = async (req, res) => {
    res.status(200).json({ poruka: 'getJedanUnos još nije implementiran' });
};

const azurirajUnos = async (req, res) => {
    res.status(200).json({ poruka: 'azurirajUnos još nije implementiran' });
};

const obrisiUnos = async (req, res) => {
    res.status(200).json({ poruka: 'obrisiUnos još nije implementiran' });
};

module.exports = {
    kreirajUnos,
    getSviUnosi,
    getJedanUnos,
    azurirajUnos,
    obrisiUnos
};