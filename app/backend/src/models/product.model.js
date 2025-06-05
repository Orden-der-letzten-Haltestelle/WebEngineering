// import PostgreSQL
import { pool } from "./pool.js"

//imports objects
import Product from "../objects/items/Product.js"

/*
Das Model Product beinhalted alle SQL-Abfragen
*/

/**
 * Finds all Products in the Database
 * @returns
 */
async function findAllProducts() {
    const result = await pool.query("SELECT * FROM webshop.products")

    //map result into objects
    const products = result.rows.map((row) => {
        return new Product(row.id, row.name, row.description, row.amount, row.price)
    })
    return products
}

export default {
    findAllProducts,
}
