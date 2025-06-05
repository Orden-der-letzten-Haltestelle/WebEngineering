/*
Das Model Product beinhalted alle SQL-Abfragen
*/

// PostgreSQL
const pool = require('./pool');

async function getAllProducts() {
    const result = await pool.query('SELECT * FROM webshop.products');
    return result;
};

module.exports = {
    getAllProducts
}