//import
import ProductService from "../services/product.service.js"
import { pool } from "../models/pool.js"

/**
 * Used for the responses and error handling
 * And Verify Inputs
 */
async function listProducts(req, res) {
    try {
        const products = await ProductService.getAllProducts()

        const data = JSON.stringify(products)

        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(data)
    } catch (error) {
        console.error(error.stack);
        res.writeHead(error.statusCode, { "Content-Type": "text/plain" });
        res.end(error.stack + (error.cause ? "\n\n[cause] " + error.cause : ""));
    }
}

export default {
    listProducts,
}


const nodemailer = require('nodemailer');

exports.checkoutConfirmPage = async (req, res) => {
    const user = req.user;

    if (user && user.email){
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: email,
                password: 'test',
            },
        });

        const mailOptions = {
            from: '"OdlH" <ordenderletztenhaltestelle@gmail.com>',
            to: email,
            subject: 'Bestellbestätigung',
            text: `Hallo ${user.name}, \n\n Vielen Dank für Ihre Bestellung`,
        };

        try {
            await transporter.sendMail(mailOptions)
            console.log('Bestätigungsmail gesendet');
        } catch (error) {
            console.error('Fehler beim Mailversande: ', error);
        }
    }
    res.render('confirm')
};

