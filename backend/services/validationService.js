const pool = require('../config/db');
const validUrl = require('valid-url');
const { extname } = require('path');

module.exports = {
    async validateLokacija(naziv, geo_sirina, geo_duljina) {
        // Provjera duplikata lokacije
        const result = await pool.query(
            `SELECT 1 FROM Lokacija 
             WHERE naziv_lokacije = $1 
             OR (geo_sirina = $2 AND geo_duljina = $3)`,
            [naziv, geo_sirina, geo_duljina]
        );
        
        if (result.rows.length > 0) {
            throw new Error('Lokacija s tim nazivom ili koordinatama već postoji');
        }
    },

    validateImageUrl(url) {
        if (!validUrl.isWebUri(url)) {
            throw new Error('URL slike nije podržn');
        }
        
        const allowedExtensions = ['.jpg', '.jpeg', '.png'];
        const extension = extname(new URL(url).pathname).toLowerCase();
        
        if (!allowedExtensions.includes(extension)) {
            throw new Error('URL slike mora biti slika (jpg, jpeg, png)');
        }
    },

    async validateUnos(id_gljiva, id_lokacija, id_korisnik, excludeId = null) {
        const [gljiva, lokacija] = await Promise.all([
            pool.query('SELECT 1 FROM Gljiva WHERE id_gljiva = $1', [id_gljiva]),
            pool.query('SELECT 1 FROM Lokacija WHERE id_lokacija = $1', [id_lokacija])
        ]);
        
        if (gljiva.rows.length === 0) {
            throw new Error('Gljiva nije pronađena');
        }
        
        if (lokacija.rows.length === 0) {
            throw new Error('Lokacija nije pronađena');
        }
        const today = new Date().toISOString().split('T')[0];
        let query = `
            SELECT 1 FROM Unos 
            WHERE id_gljiva = $1 AND id_lokacija = $2 AND id_korisnik = $3
            AND DATE(datum_unosa) = $4
        `;
        const params = [id_gljiva, id_lokacija, id_korisnik, today];
        
        if (excludeId) {
            query += ' AND id_unos != $5';
            params.push(excludeId);
        }
        
        const result = await pool.query(query, params);
        if (result.rows.length > 0) {
            throw new Error('Već ste unijeli ovu gljivu na ovoj lokaciji danas');
        }
    },
};