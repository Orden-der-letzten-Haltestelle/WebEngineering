const http = require('http');
const { Pool } = require('pg');
const url = require('url');

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (req.method === 'GET' && parsedUrl.pathname === '/api') {
        try {
            const result = await pool.query('SELECT * FROM products');
            const data = JSON.stringify(result.rows);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Fehler beim Abrufen der Daten');
        }

    } else if (req.method === 'GET' && parsedUrl.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Webshop Backend läuft.');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Nicht gefunden');
    }
});

const port = 3000;
server.listen(port, () => {
    console.log(`HTTP Server läuft auf Port ${port}`);
});