import { updateWishlistItemAmount, deleteWishlistItemById, updateWishlistInfo } from "../api/WishlistApiHandler.js";


window.handleUpdateWishlistItemAmount = function handleUpdateWishlistItemAmount(WishlistItemId, newAmount, token) {
    updateWishlistItemAmount(WishlistItemId, newAmount, token).then(() => {
        window.location.reload()
    }).catch((err) => {
        alert("❌ Failed to update amount of WishlistItem: " + (err.message || "Unknown error"));
        console.error(err)
    })
}

window.handleDeleteWishlistItemById = function handleDeleteWishlistItemById(id, token) {
    deleteWishlistItemById(id, token).then(() => {
        window.location.reload()
    }).catch((err) => {
        alert("❌ Failed to delete WishlistItem: " + (err.message || "Unknown error"));
        console.error(err)
    })
}

window.handleUpdateWishlistInfo = function handleUpdateWishlistInfo(id, token) {
    const wishlistName = document.getElementById('wishlistName').value;
    const description = document.getElementById('description').value;

    updateWishlistInfo(id, token, wishlistName, description).then(() => {
        window.location.reload()
    }).catch((err) => {
        alert("❌ Failed to update wishlist info: " + (err.message || "Unknown error"));
        console.error(err)
    })

}