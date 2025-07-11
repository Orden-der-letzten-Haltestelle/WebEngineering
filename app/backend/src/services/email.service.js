import nodemailer from "nodemailer"
import SendEmailError from "../exceptions/SendEmailError.js"
import dotenv from 'dotenv';

dotenv.config();    //needed for the password

//email setup
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "ordenderletztenhaltestelle@gmail.com",
        pass: process.env.WEBSHOP_EMAIL_PASSWORD,
    },
})

/**
 * sends an email
 * @param {string} email
 * @param {string} subject
 * @param {string} text
 */
function sendMail(email, subject, text) {
    try {
        const mailOptions = {
            from: "ordenderletztenhaltestelle@gmail.com",
            to: email,
            subject: subject,
            text: text,
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                throw error
            } else {
                console.log(
                    `Email sent successfull to ${email}: ${info.response}`
                )
            }
        })
    } catch (error) {
        throw new SendEmailError(`Failed sending email to ${email}`, {
            originalError: error,
        })
    }
}

/**
 * Sends an email, with an html body
 * @param {string} email
 * @param {string} subject
 * @param {string} html
 */
function sendHtmlMail(email, subject, html) {
    try {
        const mailOptions = {
            from: "ordenderletztenhaltestelle@gmail.com",
            to: email,
            subject: subject,
            html: html,
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                throw error
            } else {
                console.log(
                    `Html Email sent successfull to ${email}: ${info.response}`
                )
            }
        })
    } catch (error) {
        throw new SendEmailError(`Failed sending html email to ${email}`, {
            originalError: error,
        })
    }
}

export default {
    sendMail,
    sendHtmlMail,
}
