import {
    createWishlist,
} from "../api/WishlistApiHandler.js"

window.handleCreateWishlist = function handleCreateWishlist(event, token) {
    event.preventDefault()
    console.log("test1")


    const name = document.getElementById('name-new').value;
    const description = document.getElementById('description-new').value;

    createWishlist(token, name, description)
        .then(() => {
            console.log(res)
            window.location.href = `/wishlist/${res.id}`;
        })
        .catch((err) => {
            alert("❌ Failed to create wishlists: " + (err.message || "Unknown error"))  //need to be changed to toast!!!!!!!!!!!!!!
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
            alert(
                "❌ Creating new Product Failed: " +
                    (err.message || "Unknown error")
            )
            console.error(err)
        })
}