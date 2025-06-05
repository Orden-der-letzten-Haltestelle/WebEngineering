/*
Der Controller con Produkte validiert die Eingaben und Implementiert die Logik.
*/

const ProductService = require("../services/product.service")

async function listProducts(req, res) {
    try {
        const products = await ProductService.getAllProducts()

        const data = JSON.stringify(products.rows)

        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(data)
    } catch (error) {
        // === Genauere Fehler Meldungen === || === To Do More
        res.writeHead(500, { "Content-Type": "text/plain" })
        res.end("Interner Server Fehler")
    }
}

module.exports = {
    listProducts,
}
