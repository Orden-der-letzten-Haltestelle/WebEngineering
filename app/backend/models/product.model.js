// import PostgreSQL
import { pool } from "./pool.js"


/*
Das Model Product beinhalted alle SQL-Abfragen
*/

/**
 * Finds all Products in the Database
 * @returns {Promise<Product[]>}
 * @returns
 */
async function findAllProducts() {
    const result = await pool.query("SELECT * FROM webshop.products")

    return products
}

export default {
    findAllProducts,
}
