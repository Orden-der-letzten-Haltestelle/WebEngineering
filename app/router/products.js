const express = require('express');
const router = express.Router();

// Middleware
// 

// PostgreSQL
const pool = require('./pool');

// define routes
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM webshop.products');
        const data = JSON.stringify(result.rows);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
    } catch (err) {
        // === Genauere Fehler Meldungen === || === To Do More
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Interner Server Fehler');
    }
});

module.exports = router;