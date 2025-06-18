import BadRequestError from "../exceptions/BadRequestError.js"
import CartModel from "../models/cart.model.js"
import CartItem from "../objects/items/CartItem.js"
import OrderItem from "../objects/items/OrderItem.js"
import Product from "../objects/items/Product.js"
import EmailService from "./email.service.js"
import UserService from "./user.service.js"
import CartValidator from "../validator/validator.cart.js"
import ForbiddenError from "../exceptions/ForbiddenError.js"
import ProductService from "./product.service.js"
import NotFoundError from "../exceptions/NotFoundError.js"

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
        throw new ForbiddenError(
            `CartItem with the id ${cartItemId} isn't owned by the requesting user`
        )
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

    //proof that every product has enough storage to be purchased
    const cart = await getCart()
    cart.forEach((item) => {
        if (item.amount > item.product.amount) {
            throw new BadRequestError(
                `The product with id ${item.product.id} hasn't enough amount in storage as you request.`
            )
        }
    })

    //set all cartItems with bough=false, on bought And update the product storage amount
    const orderItems = await CartModel.completePurchase(userId, cart)

    //get email and send mail
    const user = await UserService.getBasicUserById(userId)
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
                    <th>Einzel Preis</th>
                    <th>Menge</th>
                    <th>Gesammt Preis</th>
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
                <td>${item.product.getConvertedPriceMultiplied(
                    item.amount
                )}</td>
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

async function addProduct(userId, productId, amount) {
    //test for valid amount and if product exists
    await CartValidator.isValidAmount(productId, amount)

    //get cartitem, when an item with the product id is already in the cart
    let existingCartItem = null
    try {
        existingCartItem =
            await CartModel.findByUserIdAndProductIdAndBoughtFalse(
                userId,
                productId
            )
    } catch (error) {
        //ignore NotFoundError
        if (!(error instanceof NotFoundError)) {
            throw error
        }
    }

    if (existingCartItem !== null) {
        // handle product already in cart, change amount
        const newAmount = existingCartItem.amount + amount
        await CartModel.updateCartItemAmount(existingCartItem.id, newAmount)
    } else {
        //product not in cart, create new
        await CartModel.createCartItem(userId, productId, amount)
    }
    //return new cart
    return await getCart(userId)
}

/**
 * Delets all cartItems of the given user.
 * @param {int} userId
 */
async function deleteCart(userId) {
    return await CartModel.deleteAllCartItemsByUserId(userId)
}

export default {
    getCart,
    buyCart,
    updateCartItemAmount,
    addProduct,
    deleteCart,
}
