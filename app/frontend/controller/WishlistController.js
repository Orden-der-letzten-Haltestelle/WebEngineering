import {
    updateWishlistItemAmount,
    deleteWishlistItemById,
    updateWishlistInfo,
    createWishlist,
    deleteWishlist,
    updateWishlistMemberRole,
    addWishlistMember,
    deleteWishlistMember,
} from "../api/WishlistApiHandler.js"

import { showToast } from "../helper.js"

import { fetchUserByEmail } from "../api/user.js"

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
            alert(
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
            alert(
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
            alert(
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
            window.location.reload()
        })
        .catch((err) => {
            alert(
                "❌ Failed to create wishlists: " +
                    (err.message || "Unknown error")
            ) //need to be changed to toast!!!!!!!!!!!!!!
            console.error(err)
        })
}

window.handleDeleteWishlist = function handleDeleteWishlist(event, token) {
    event.preventDefault()

    const wishlistId = document
        .getElementById("deleteWishlist")
        .getAttribute("data-id")
    deleteWishlist(token, wishlistId)
        .then((res) => {
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

window.handleAddWishlistMember = function handleAddWishlistMember(
    token,
    wishlistId
) {
    const email = document.getElementById("nutzerEmail").value
    fetchUserByEmail(token, email)
        .then((res) => {
            addWishlistMember(token, wishlistId, res.id, 1)
                .then(() => {
                    window.location.reload()
                })
                .catch((err) => {
                    showToast(
                        "❌ failed Adding Wishlist Member: " +
                            (err.message || "Unknown error")
                    )
                    console.error(err)
                })
        })
        .catch((err) => {
            showToast(
                "❌ failed finding user: " + (err.message || "Unknown error")
            )
            console.error(err)
            return
        })
}

window.handleDeleteWishlistMember = function handleDeleteWishlistMember(
    token,
    userWishlistRelationId
) {
    deleteWishlistMember(token, userWishlistRelationId)
        .then(() => {
            window.location.reload()
        })
        .catch((err) => {
            showToast(
                "❌ failed Deleting Wishlist Member: " +
                    (err.message || "Unknown error")
            )
            console.error(err)
        })
}

window.handleUpdateWishlistMemberRole = function handleUpdateWishlistMemberRole(
    token,
    userWishlistRelationId,
    newRoleLevel
) {
    updateWishlistMemberRole(token, userWishlistRelationId, newRoleLevel)
        .then(() => {
            window.location.reload()
        })
        .catch((err) => {
            showToast(
                "❌ failed Update Wishlist Member Role: " +
                    (err.message || "Unknown error")
            )
            console.error(err)
        })
}
