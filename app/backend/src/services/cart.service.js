import BadRequestError from "../exceptions/BadRequestError.js"
import CartModel from "../models/cart.model.js"
import CartItem from "../objects/items/CartItem.js"
import OrderItem from "../objects/items/OrderItem.js"
import Product from "../objects/items/Product.js"
import EmailService from "./email.service.js"
import UserService from "./user.service.js"
import CartValidator from "../validator/validator.cart.js"
import ForbiddenError from "../exceptions/ForbiddenError.js"

/**
 * Returns all CartItems with bought == false, that the user has.
 *
 * @param {int} userId
 * @returns {Promise<CartItem[]>}
 */
async function getCart(userId) {
    const cartItems = await CartModel.findCartItemsByUserId(userId)
    return cartItems
}

async function updateCartItemAmount(userId, cartItemId, newAmount) {
    //get cartitem, only when its on bought = false 
    const cartItem = await CartModel.findCartItemByIdAndBoughtFalse(cartItemId)

    //proof requesting user owns cartItem
    if (cartItem.ownerId !== userId) {
        throw new ForbiddenError(`CartItem with the id ${cartItemId} isn't owned by the requesting user`)
    }

    //proof if enough is in storage
    await CartValidator.isValidAmount(cartItem.product.id, newAmount)

    //update amount
    await CartModel.updateCartItemAmount(cartItemId, newAmount)

    //return new cart
    const newCart = await getCart(userId)
    return newCart
}

/**
 * Sets all items in the users shopping cart on bought.
 * And sends an email, with the order confirmation
 * @param {int} userId
 * @returns
 * @throws {BadRequestError}
 */
async function buyCart(userId) {
    const numberOfCartItems = await CartModel.countCartItemsByUserId(userId)
    if (numberOfCartItems <= 0) {
        throw new BadRequestError("Empty Cart, please add an product first.")
    }

    //set all cartItems with bough=false, on bought
    const orderItems = await CartModel.setCartItemsOnBoughtByUserId(userId)
    //TODO update product amount 

    //get email
    const user = await UserService.getBasicUserById(userId)
    //send mail
    await sendBuyEmail(user.email, orderItems)

    return orderItems
}

/**
 * Send Order confirmation mail
 * @param {string} email
 * @param {OrderItem[]} orderItems
 */
async function sendBuyEmail(email, orderItems) {
    //build email body
    const date = new Date()
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}.${String(
        date.getMonth() + 1
    ).padStart(2, "0")}.${date.getFullYear()}`

    let emailBody = `
        <html>
        <head>
            <style>
               body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                }
                h1 {
                    color: #333;
                    text-align: center;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
            </style>
        </head>
        <h1>Bestell Besätigung ${formattedDate}</h1>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Beschreibung</th>
                    <th>Preis</th>
                    <th>Menge</th>
                </tr>
            </thead>
            <tbody>
        `

    //add rows to table
    orderItems.forEach((item) => {
        emailBody += `
            <tr>
                <td>${item.product.name}</td>
                <td>${item.product.description}</td>
                <td>${item.product.getConvertedPrice()}</td> 
                <td>${item.amount}</td> 
            </tr>
            `
    })
    emailBody += `
        </tbody>
        </table>
        </body>
        </html>
    `

    EmailService.sendHtmlMail(
        email,
        `Bestellbesätigung ${formattedDate}`,
        emailBody
    )
}

export default {
    getCart,
    buyCart,
    updateCartItemAmount,
}
