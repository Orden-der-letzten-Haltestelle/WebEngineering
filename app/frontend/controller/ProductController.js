import { addproductTocart } from "../api/CartApiHandler.js"

window.handleAddtocartWithEvent = function handleAddtocartWithEvent(
    e,
    productId,
    token
) {
    e.preventDefault()

    if (token == "") {
        console.log("Token has to be given")
        window.location.href = "http://localhost:3000/login"
        return
    } else {
        addproductTocart(productId, token)
            .then(() => {
                window.location.href = "http://localhost:3000/cart"
            })
            .catch((err) => {
                alert("❌ Add to cart: " + (err.message || "Unknown error"))
                console.error(err)
            })
    }
}
