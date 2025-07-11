import {
    createWishlist,
    deleteWishlist,
    addProductToWishlist,
} from "../api/wishlistApiHandler.js"
import { showToast } from "../helper.js";

window.handleCreateWishlist = function handleCreateWishlist(event, token) {
    event.preventDefault()

    const name = document.getElementById('name-new').value;
    const description = document.getElementById('description-new').value;

    const res = createWishlist(token, name, description)
        .then(() => {
            console.log(res)
            window.location.reload()
        })
        .catch((err) => {
            showToast("❌ Failed to create wishlists: " + (err.message || "Unknown error"))
            console.error(err)
        })
}

window.handleDeleteWishlist = function handleDeleteWishlist(event, token) {
    event.preventDefault()

    const wishlistId = document.getElementById('deleteWishlist').getAttribute('data-id');
    console.log(wishlistId)
    deleteWishlist(token, wishlistId)
        .then((res) => {
            console.log(res)
            window.location.href = `http://localhost:3000/wishlist`
        })
        .catch((err) => {
            showToast(
                "❌ deleting Wishlist Failed: " +
                    (err.message || "Unknown error")
            )
            console.error(err)
        })
}

window.handleAddProductToWishlist = function handleAddProductToWishlist(token, wishlistId, productId) {
    addProductToWishlist(token, wishlistId, productId)
        .then((res) => {
            console.log(res)
            window.location.href = `http://localhost:3000/wishlist/${wishlistId}`
        })
        .catch((err) => {
            showToast(
                "❌ adding Product to wishlist Failed: " +
                    (err.message || "Unknown error")
            )
            console.error(err)
        })
}