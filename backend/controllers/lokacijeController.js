const pool = require('../db');

const getSveLokacije = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM Lokacija");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Greška pri dohvaćanju lokacija" });
    }
};

const dodajLokaciju = async (req, res) => {
    const { naziv } = req.body;

    if (!naziv) return res.status(400).json({ error: "Naziv je obavezan" });

    try {
        const result = await pool.query(
        "INSERT INTO Lokacija (naziv) VALUES ($1) RETURNING id_lokacija",
        [naziv]
        );

        res.status(201).json({ id_lokacija: result.rows[0].id_lokacija });
    } catch (err) {
        res.status(500).json({ error: "Greška pri dodavanju lokacije" });
    }
};

module.exports = { getSveLokacije, dodajLokaciju };