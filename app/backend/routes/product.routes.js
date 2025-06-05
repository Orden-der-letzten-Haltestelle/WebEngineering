/*
Hier wird einfach nur den verschieden Routes von Products den Funktionen zugeordnet
*/

const express = require('express');
const router = express.Router();

// Middleware
// 

// Import
const ProductController = require('../controllers/product.controller');

// define routes
router.get('/', ProductController.listProducts);

module.exports = router;