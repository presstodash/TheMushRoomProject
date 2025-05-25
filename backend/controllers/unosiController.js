const pool = require('../db');

const kreirajUnos = async (req, res) => {
    try {
      const { id_gljiva, id_lokacija } = req.body;
      const id_korisnik = req.korisnik.id;
  
      const noviUnos = await unosModel.create({
        id_gljiva,
        id_lokacija,
        id_korisnik
      });
  
      return res.status(201).json({
        poruka: 'Unos dodan',
        unos: noviUnos
      });
    } catch (err) {
      return res.status(400).json({ error: err.message });
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
            l.naziv_lokacije AS lokacija,
            TO_CHAR(u.datum_unosa, 'YYYY-MM-DD') AS datum_unosa
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
    const { id } = req.params;
    const korisnikId = req.korisnik.id;

    try {
        const result = await pool.query(
            `SELECT u.id_unos, u.id_gljiva, u.id_lokacija
            FROM Unos u
            WHERE u.id_unos = $1 AND u.id_korisnik = $2`,
            [id, korisnikId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Unos nije pronađen" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Greška pri dohvaćanju unosa:", err.message);
        res.status(500).json({ error: "Greška na serveru" });
    }
};

const azurirajUnos = async (req, res) => {
    const id_unos = req.params.id;
    const { id_gljiva, id_lokacija } = req.body;
    const korisnikId = req.korisnik?.id;

    if (!id_gljiva || !id_lokacija) {
        return res.status(400).json({ error: "Sva polja su obavezna." });
    }

    try {
        const provjera = await pool.query(
            "SELECT * FROM Unos WHERE id_unos = $1 AND id_korisnik = $2",
            [id_unos, korisnikId]
        );

        if (provjera.rows.length === 0) {
            return res.status(404).json({ error: "Unos nije pronađen." });
        }

        await pool.query(
            "UPDATE Unos SET id_gljiva = $1, id_lokacija = $2 WHERE id_unos = $3",
            [id_gljiva, id_lokacija, id_unos]
        );

        return res.status(200).json({ poruka: "Unos ažuriran uspješno." });
    } catch (err) {
        console.error("Greška pri ažuriranju unosa:", err.message);
        res.status(500).json({ error: "Greška na serveru." });
    }
};

const obrisiUnos = async (req, res) => {
    const id = req.params.id;
    const id_korisnik = req.korisnik.id;

    try {
      const provjera = await pool.query(
            "SELECT * FROM Unos WHERE id_unos = $1 AND id_korisnik = $2",
            [id, id_korisnik]
      );
      if (provjera.rows.length === 0) {
            return res.status(403).json({ error: "Nemate prava za brisanje ovog unosa" });
      }

        await pool.query("DELETE FROM Unos WHERE id_unos = $1", [id]);
        res.status(200).json({ poruka: "Unos uspješno obrisan" });
    } catch (err) {
        console.error("Greška pri brisanju unosa:", err.message);
        res.status(500).json({ error: "Greška prilikom brisanja" });
    }
};

module.exports = {
    kreirajUnos,
    getSviUnosi,
    getJedanUnos,
    azurirajUnos,
    obrisiUnos
};