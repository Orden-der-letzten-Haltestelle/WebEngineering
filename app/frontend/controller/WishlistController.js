import {
    createWishlist,
    deleteWishlist,
} from "../api/WishlistApiHandler.js"

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
            alert("❌ Failed to create wishlists: " + (err.message || "Unknown error"))  //need to be changed to toast!!!!!!!!!!!!!!
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
            alert(
                "❌ deleting Product Failed: " +
                    (err.message || "Unknown error")
            )
            console.error(err)
        })
}