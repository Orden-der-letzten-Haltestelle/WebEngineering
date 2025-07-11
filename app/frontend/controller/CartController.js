import { addproductTocart, deleteCartItem, updateAmount, deleteCart } from "../api/CartApiHandler.js"
import { showToast } from "../helper.js";

window.handleDeleteCartItem = function handleDeleteCartItem(cartItemId, token) {
    deleteCartItem(cartItemId, token).then(() => {
        window.location.reload();
    }).catch((err) => {
        showToast("❌ Failed to delete CartItem: " + (err.message || "Unknown error"));
        console.error(err)
    })
}

window.handleUpdateCartItemAmount = function handleUpdateCartItemAmount(cartItemId, newAmount, token) {
    updateAmount(cartItemId, newAmount, token).then(() => {
        window.location.reload();
    }).catch((err) => {
        showToast("❌ Failed to update amount of CartItem: " + (err.message || "Unknown error"));
        console.error(err)
    })
}

window.handleDeleteCart = function handleDeleteCart(token) {
    deleteCart(token).then(() => {
        window.location.reload()
    }).catch((err) => {
        showToast("❌ Failed to delete Cart: " + (err.message || "Unknown error"));
        console.error(err)
    })
}
window.handleAddtocart = function handleAddtocart(productId, token, amount = 1) {
    addproductTocart(productId, token, amount).then(() => {
        window.location.href = "http://localhost:3000/cart";
    }).catch((err) => {
        showToast("❌ Add to cart: " + (err.message || "Unknown error"));
        console.error(err)
    })
}