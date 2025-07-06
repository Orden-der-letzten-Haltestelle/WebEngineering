import { addProductToCart } from "../api/productApiHandler.js"

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

  window.handleUpdateCartItemAmount = async function(cartItemId, newAmount, token) {
    if (!token) {
        window.location.href = "/login";
        return;
    }
     updateAmount(cartItemId, newAmount, token).then(() => {
         window.location.reload();
     }).catch((err) => {
         alert("❌ Failed to update amount of CartItem: " + (err.message || "Unknown error"));
         console.error(err)
     })
  }