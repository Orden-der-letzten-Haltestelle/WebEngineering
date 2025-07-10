import { deleteWishlistItemById } from "../api/WishlistApiHandler.js";

window.handleDeleteWishlistItemById = function handleDeleteWishlistItemById(id, token) {
    deleteWishlistItemById(id, token).then(() => {

    }).catch((err) => {
        alert(
            "❌ Failed to delete WishlistItem: " + (err.message || "Unknown error")
        )      
        console.error(err)
    })
}

window.handleUpdateWishlistItemAmount = function handleUpdateWishlistItemAmount(WishlistItemId, newAmount, token) {
    updateAmount(WishlistItemId, newAmount, token).then(() => {
        window.location.reload();
    }).catch((err) => {
        alert("❌ Failed to update amount of WishlistItem: " + (err.message || "Unknown error"));
        console.error(err)
    })
}