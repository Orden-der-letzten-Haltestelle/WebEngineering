//import
import ProductService from "../services/product.service.js"

/*
Der Controller con Produkte validiert die Eingaben und Implementiert die Logik.
*/

async function listProducts(req, res) {
    try {
        const products = await ProductService.getAllProducts()

        const data = JSON.stringify(products)

        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(data)
    } catch (error) {
        console.error(error)

        //handle expected errors
        if (error instanceof DatabaseError) {
            res.writeHead(error.statusCode, {
                "Content-Type": "application/json",
            })
            res.end(JSON.stringify({ error: error.message }))
        } else {
            //unexpected error
            res.writeHead(500, { "Content-Type": "text/plain" })
            res.end("Interner Server Fehler")
        }
    }
}

export default {
    listProducts,
}
