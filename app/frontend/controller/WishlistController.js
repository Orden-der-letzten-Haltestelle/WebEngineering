import {
    updateWishlistItemAmount,
    deleteWishlistItemById,
    updateWishlistInfo,
    createWishlist,
    deleteWishlist,
    addProductToWishlist
} from "../api/WishlistApiHandler.js"
import { showToast } from "../helper.js"

window.handleUpdateWishlistItemAmount = function handleUpdateWishlistItemAmount(
    WishlistItemId,
    newAmount,
    token
) {
    updateWishlistItemAmount(WishlistItemId, newAmount, token)
        .then(() => {
            window.location.reload()
        })
        .catch((err) => {
            showToast(
                "❌ Failed to update amount of WishlistItem: " +
                    (err.message || "Unknown error")
            )
            console.error(err)
        })
}

window.handleDeleteWishlistItemById = function handleDeleteWishlistItemById(
    id,
    token
) {
    deleteWishlistItemById(id, token)
        .then(() => {
            window.location.reload()
        })
        .catch((err) => {
            showToast(
                "❌ Failed to delete WishlistItem: " +
                    (err.message || "Unknown error")
            )
            console.error(err)
        })
}

window.handleUpdateWishlistInfo = function handleUpdateWishlistInfo(id, token) {
    const wishlistName = document.getElementById("wishlistName").value
    const description = document.getElementById("description").value

    updateWishlistInfo(id, token, wishlistName, description)
        .then(() => {
            window.location.reload()
        })
        .catch((err) => {
            showToast(
                "❌ Failed to update wishlist info: " +
                    (err.message || "Unknown error")
            )
            console.error(err)
        })
}

window.handleCreateWishlist = function handleCreateWishlist(event, token) {
    event.preventDefault()

    const name = document.getElementById("name-new").value
    const description = document.getElementById("description-new").value

    const res = createWishlist(token, name, description)
        .then(() => {
            console.log(res)
            window.location.reload()
        })
        .catch((err) => {
            showToast(
                "❌ Failed to create wishlists: " +
                    (err.message || "Unknown error")
            )
            console.error(err)
        })
}

window.handleDeleteWishlist = function handleDeleteWishlist(event, token) {
    event.preventDefault()

    const wishlistId = document
        .getElementById("deleteWishlist")
        .getAttribute("data-id")
    console.log(wishlistId)
    deleteWishlist(token, wishlistId)
        .then((res) => {
            console.log(res)
            window.location.href = `http://localhost:3000/wishlist`
        })
        .catch((err) => {
            showToast(
                "❌ deleting Product Failed: " +
                    (err.message || "Unknown error")
            )
            console.error(err)
        })
}

window.handleAddProductToWishlist = function handleAddProductToWishlist(
    token,
    wishlistId,
    productId
) {
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
