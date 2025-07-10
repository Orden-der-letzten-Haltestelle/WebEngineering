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