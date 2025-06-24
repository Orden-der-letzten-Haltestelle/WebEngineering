import { deleteCart, updateAmount } from "../api/CartApiHandler.js"

window.handleDeleteCartItem = function handleDeleteCartItem(cartItemId, token) {
    deleteCart(cartItemId, token).then(() => {
        window.location.reload();
    }).catch((err) => {
        alert("❌ Failed to delete CartItem: " + (err.message || "Unknown error"));
        console.error(err)
    })
}

window.handleUpdateCartItemAmount = function handleUpdateCartItemAmount(cartItemId, newAmount, token) {
    updateAmount(cartItemId, newAmount, token).then(() => {
        window.location.reload();
    }).catch((err) => {
        alert("❌ Failed to update amount of CartItem: " + (err.message || "Unknown error"));
        console.error(err)
    })
}