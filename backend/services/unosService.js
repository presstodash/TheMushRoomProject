async function searchUnosi(query, userId) {
    const result = await pool.query(`
        SELECT u.*, g.hrvatski_naziv, g.latinski_naziv, l.naziv_lokacije 
        FROM Unos u
        JOIN Gljiva g ON u.id_gljiva = g.id_gljiva
        JOIN Lokacija l ON u.id_lokacija = l.id_lokacija
        WHERE u.id_korisnik = $1
        AND (g.hrvatski_naziv ILIKE $2 OR g.latinski_naziv ILIKE $2 OR l.naziv_lokacije ILIKE $2)
    `, [userId, `%${query}%`]);
    
    return result.rows;
}

async function updateUnos(id, unosData, userId) {
    if (unosData.id_lokacija) {
        const existing = await pool.query(
            'SELECT id_lokacija FROM Unos WHERE id_unos = $1 AND id_korisnik = $2',
            [id, userId]
        );
        
        if (existing.rows.length === 0) {
            throw new Error('Unos nije pronađen ili nije vaš');
        }
        
        await ValidationService.validateUnos(
            unosData.id_gljiva || existing.rows[0].id_gljiva,
            unosData.id_lokacija,
            userId
        );
    }
    const updates = [];
    const values = [];
    let i = 1;
    
    for (const [key, value] of Object.entries(unosData)) {
        if (value !== undefined) {
            updates.push(`${key} = $${i}`);
            values.push(value);
            i++;
        }
    }
    
    if (updates.length === 0) {
        throw new Error('Nema podataka za ažuriranje');
    }
    
    values.push(id, userId);
    
    const query = `
        UPDATE Unos 
        SET ${updates.join(', ')}
        WHERE id_unos = $${i} AND id_korisnik = $${i+1}
        RETURNING *
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
}

async function deleteUnos(id, userId) {
    const result = await pool.query(
        'DELETE FROM Unos WHERE id_unos = $1 AND id_korisnik = $2 RETURNING *',
        [id, userId]
    );
    
    if (result.rows.length === 0) {
        throw new Error('Unos nije pronađen ili nije vaš');
    }
}