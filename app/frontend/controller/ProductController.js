import { addproductTocart } from "../api/CartApiHandler.js"
import { updateProduct, deleteProduct, createProduct } from "../api/productApiHandler.js"
import { showToast } from "../helper.js"

window.handleAddtocartWithEvent = function handleAddtocartWithEvent(
    e = undefined,
    productId,
    token
) {
    if (e?.preventDefault != undefined) {
        e?.preventDefault()
    }

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
                showToast("❌ Add to cart: " + (err.message || "Unknown error"))
                console.error(err)
            })
    }
}

window.handleUpdateProduct = function handleUpdateProduct(
    event,
    productId,
    token
) {
    event.preventDefault()
    const name = document.getElementById("name").value
    const description = document.getElementById("description").value
    const price = document.getElementById("price").value * 100
    const amount = document.getElementById("amount").value
    updateProduct(productId, token, name, description, price, amount)
        .then(() => {
            window.location.reload()
        })
        .catch((err) => {
            showToast("❌ failed Update Product information: " +(err.message || "Unknown error"))
            console.error(err)
        })
}

window.handleCreateProduct = function handleCreateProduct(event, token) {
    event.preventDefault()

    const name = document.getElementById("productName").value
    const description = document.getElementById("description").value
    const amount = document.getElementById("amount").value
    const price = document.getElementById("price").value * 100

    createProduct(token, name, description, amount, price)
        .then((res) => {
            console.log(res)
            window.location.href = `http://localhost:3000/product/${res.id}`
        })
        .catch((err) => {
            showToast("❌ Creating new Product Failed: " + (err.message || "Unknown error"))
            console.error(err)
        })

}


window.handleDeleteProduct = function handleDeleteProduct(productId, token) {
    deleteProduct(productId, token)
        .then(() => {
            window.location.href = "http://localhost:3000"
        })
        .catch((err) => {
            showToast("❌ failed Delete Product: " + (err.message || "Unknown error"))
            console.error(err)
        })
}
