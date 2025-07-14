Das Backend wird in drei Schichten aufgeteilt, nach der [Schichten Architektur](https://dev.to/blindkai/backend-layered-architecture-514h).

# Controller-Schicht
In der Controller-Schicht, werden alle Endpunkte definiert. 
Hier werden der Anfrage header und body ausgelesen, um die übergebenen Informationen nutzen zu können. Außerdem wird in dieser Schicht falls benötigt, der JWT-token extrahiert und ausgelesen. Um anschließend überprüfen zu können, ob der Nutzer berechtigt ist, Informationen von diesem Endpunkt zu erhalten.

Zur besseren Lesbarkeit, wurde diese schicht in zwei Dateien aufgeteil. Einmal die controller und die routes. 
In den Routes werden die eigentlichen Endpunkte für express definiert, während im controller die Logik ist, um den Endpunkt richtig zu verarbeiten.

## routes für Produkt Service
```javascript
import express from "express"
const router = express.Router()

//controlle
import ProductController from "../controllers/product.controller.js"

/*
Hier wird einfach nur den verschieden Routes von Products den Funktionen zugeordnet
*/

// define routes
router.get("/", ProductController.listProducts)

export default router
```

## Controller für Produkt Service
```javascript
import ProductService from "../services/product.service.js"
import DatabaseError from "../exceptions/DatabaseError.js"

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
```

# Service-Schicht
In der Service-Schicht, ist die Business Logik untergebracht. 
Bspw.: Prüfung von gebenen Daten, ob das Passwort langgenug ist, abschicken einer email zur verfizierung. 

## Models-Schicht
In dieser Schicht wird alles untergebracht, was mit der Datenbank zu tun hat. Bspw. querys und maping von Datenbank Rückgaben zu Javascript Objects 

```javascript
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
 * @throws {DatabaseError}
 */
async function findAllProducts() {
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
        throw new DatabaseError(`Could not fetch products from the database`, {
            cause: error,
        })
    }
}

export default {
    findAllProducts,
}

```


