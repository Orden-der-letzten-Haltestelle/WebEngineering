import {updateAmount} from "../api/WIshlistApiHandler.js"

window.handleUpdateWishlistItemAmount = function handleUpdateWishlistItemAmount(WishlistItemId, newAmount, token) {
    updateAmount(WishlistItemId, newAmount, token).then(() => {
        window.location.reload();
    }).catch((err) => {
        alert("❌ Failed to update amount of WishlistItem: " + (err.message || "Unknown error"));
        console.error(err)
    })
}