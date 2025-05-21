// Load the Database
// const pg = require('pg-promise');
// const db = pg(process.env.POSTGRES);

// The App
const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to our Webshop');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});