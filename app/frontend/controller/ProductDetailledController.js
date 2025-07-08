import { addproductTocart } from "../api/productDetailledApiHandler.js"

window.handleDeleteCart = function handleDeleteCart(token) {
    deleteCart(token).then(() => {
        window.location.reload()
    }).catch((err) => {
        alert("❌ Failed to delete Cart: " + (err.message || "Unknown error"));
        console.error(err)
    })
}