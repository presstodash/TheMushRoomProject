const pool = require('../db');


const getSviUnosi = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Unos');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ poruka: 'Greška pri dohvaćanju unosa' });
    }
};

const getJedanUnos = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await pool.query('SELECT * FROM Unos WHERE id_unos = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ poruka: 'Unos nije pronađen' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ poruka: 'Greška pri dohvaćanju unosa' });
    }
};


const createUnos = async (req, res) => {
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

const updateUnos = async (req, res, next) => {
    try {
        const updated = await UnosService.updateUnos(
            req.params.id, 
            req.body, 
            req.user.id
        );
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

const deleteUnos = async (req, res, next) => {
    try {
        await UnosService.deleteUnos(req.params.id, req.user.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createUnos,
    updateUnos,
    deleteUnos,
    getSviUnosi,
    getJedanUnos
};