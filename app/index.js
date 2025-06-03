const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});


// Endpoints
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});


// === Externe Endpoints und Connectors === || === To Do
app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM webshop.products');
        const data = JSON.stringify(result.rows);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
    } catch (err) {
        // === Genauere Fehler Meldungen === || === To Do
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Interner Server Fehler');
    }
});

// Server starten
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
}); 