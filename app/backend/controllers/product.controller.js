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
        // === Genauere Fehler Meldungen === || === To Do More
        console.error(error)
        res.writeHead(500, { "Content-Type": "text/plain" })
        res.end("Interner Server Fehler")
    }
}

export default {
    listProducts,
}
