import {
    createWishlist,
} from "../api/WishlistApiHandler.js"

window.handleCreateWishlist = function handleCreateWishlist(event, token) {
    event.preventDefault()
    const name = document.getElementById('name-new').value;
    const description = document.getElementById('description-new').value;

    createWishlist(token, name, description)
        .then(() => {
            window.location.href = '/wishlist';
        })
        .catch((err) => {
            alert("❌ Failed to create wishlists: " + (err.message || "Unknown error"))  //need to be changed to toast!!!!!!!!!!!!!!
            console.error(err)
        })
}