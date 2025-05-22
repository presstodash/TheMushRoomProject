const pool = require('../db');

const kreirajUnos = async (req, res) => {
    const { id_gljiva, id_lokacija } = req.body;
    const id_korisnik = 1;

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

module.exports = {
    kreirajUnos
};