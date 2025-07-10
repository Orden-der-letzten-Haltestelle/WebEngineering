import { updateAmount } from "../api/checkoutApiHandler.js"

window.handleCheckout = function handleCheckout(productId, token) {
    if (token == undefined) {
        window.location.replace("http://localhost:3000/login")
    }
    Checkout(productId, token).then(() => {
        window.location.replace("http://localhost:3000/checkout/confirm");
    }).catch((err) => {
        alert("❌ Failed to checkout: " + (err.message || "Unknown error"));
        console.error(err)
    })
}

window.handleUpdateCheckoutItemAmount = function handleUpdateCartItemAmount(cartItemId, newAmount, token) {
    newAmount = parseInt(newAmount);

    if (!token) {
        window.location.href = "/login";
        return;
    }
    updateAmount(cartItemId, newAmount, token).then(() => {
        window.location.reload();

    }).catch((err) => {
        alert("❌ Failed to update amount of CheckoutItem: " + (err.message || "Unknown error"));
        console.error(err)
    })
}