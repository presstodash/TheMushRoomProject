const pool = require('../db');

const getSveGljive = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Gljiva');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error while fetching mushrooms');
    }
};

module.exports = { getSveGljive };