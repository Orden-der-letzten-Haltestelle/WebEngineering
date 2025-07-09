import {
    getWishlists,
} from "../api/WishlistApiHandler.js"

window.handle = function handleBannUser(userId, token) { //what functions
    bannUser(userId, token)
        .then(() => {
            window.location.reload()
        })
        .catch((err) => {
            alert("❌ Failed to fetch wishlists: " + (err.message || "Unknown error"))  //need to be changed to toast!!!!!!!!!!!!!!
            console.error(err)
        })
}