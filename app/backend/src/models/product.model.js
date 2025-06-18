// import PostgreSQL
import { pool } from "./pool.js"

//imports objects
import Product from "../objects/items/Product.js"
import DatabaseError from "../exceptions/DatabaseError.js"
import NotFoundError from "../exceptions/NotFoundError.js"

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

/**
 * Returns a product by its Id, when it doesn't exist, an NotFoundError is thrown 
 * @param {int} id 
 * @returns {Promise<Product>}
 * @throws {NotFoundError}
 * @throws {DatabaseError} 
 */
async function findProductById(id) {
    try {
        const result = await pool.query(`
            SELECT  
            p.id,
            p.name,
            p.description,
            p.amount,
            p.price
            FROM 
            webshop.products as p 
            WHERE 
            p.id = $1`,
            [id])

        if (result.rows.length <= 0) {
            throw new NotFoundError(`Product with id ${id} doesn't exist`)
        }
        const row = result.rows[0]
        const product = new Product(
            row.id,
            row.name,
            row.description,
            row.amount,
            row.price
        )
        return product
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error
        }
        throw new DatabaseError(`Failed fetching Product with id ${id}: ${error}`, error)
    }

}

export default {
    findAllProducts,
    findProductById
}
