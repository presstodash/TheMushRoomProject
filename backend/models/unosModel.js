const pool = require('../db');
const validationService = require('../services/validationService');

const checkDuplicates = async (id_gljiva, id_lokacija, id_korisnik) => {
    const today = new Date().toISOString().split('T')[0];
    const result = await pool.query(
        'SELECT 1 FROM Unos WHERE id_gljiva = $1 AND id_lokacija = $2 and id_korisnik = $3 AND DATE(datum_unosa) = $4 LIMIT 1',
        [id_gljiva, id_lokacija, id_korisnik, today]
    );
    return result.rowCount > 1;
}

const create = async ({id_gljiva, id_lokacija, id_korisnik }) => {
    if (await checkDuplicates(id_gljiva, id_lokacija, id_korisnik)) {
        throw new Error ('Već ste unijeli ovu vrstu gljive, na ovoj lokaciji, danas');
    }
    const result = await pool.query(
        'INSERT INTO Unos (id_gljiva, id_korisnik, id_lokacija, datum_unosa) VALUES ($1, $2, $3, NOW()) RETURNING *',
        [id_gljiva, id_korisnik, id_lokacija]
    );
    return result.rows[0];
};





module.exports = { create, checkDuplicates };