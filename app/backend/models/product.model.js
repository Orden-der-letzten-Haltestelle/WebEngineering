//imports
// PostgreSQL
const pool = require("./pool")

/*
Das Model Product beinhalted alle SQL-Abfragen
*/

/**
 * Finds all Products in the Database
 * @returns {Promise<Product[]>}
 */
async function findAllProducts() {
    const result = await pool.query("SELECT * FROM webshop.products")

    return products
}

module.exports = {
    findAllProducts,
