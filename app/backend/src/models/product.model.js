// import PostgreSQL
import { pool } from "./pool.js"

//imports objects
import Product from "../objects/items/Product.js"
import DatabaseError from "../exceptions/DatabaseError.js"

/*
Das Model Product beinhalted alle SQL-Abfragen
*/

/**
 * Finds all Products in the Database
 * @returns
 */
async function findAllProducts2() {
    try {
        const result = await pool.query("SELECT * FROM webshop.products")

        //map result into objects
        const products = result.rows.map((row) => {
            return new Product(
                row.id,
                row.name,
                row.description,
                row.amount,
                row.price
            )
        })
        return products
    } catch (error) {
        throw new DatabaseError(
            `failed to fetch products from database: ${error.message}`,
            { cause: error }
        )
    }
}

async function findAllProducts() {
    const result = await pool.query("SELECT * FROM webshop.products")

    //map result into objects
    const products = result.rows.map((row) => {
        return new Product(
            row.id,
            row.name,
            row.description,
            row.amount,
            row.price
        )
    })
    return products
}

export default {
    findAllProducts,
}
