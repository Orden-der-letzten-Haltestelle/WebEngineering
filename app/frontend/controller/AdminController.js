import {
    bannUser,
    unbannUser,
    makeUserAdmin,
    removeAdminRoleFromUser,
} from "../api/AdminApiHandler.js"

window.handleBannUser = function handleBannUser(userId, token) {
    bannUser(userId, token)
        .then(() => {
            window.location.reload()
        })
        .catch((err) => {
            alert("❌ Failed to bann user: " + (err.message || "Unknown error"))
            console.error(err)
        })
}

window.handleUnBannUser = function handleUnBannUser(userId, token) {
    unbannUser(userId, token)
        .then(() => {
            window.location.reload()
        })
        .catch((err) => {
            alert(
                "❌ Failed to unbann user: " + (err.message || "Unknown error")
            )
            console.error(err)
        })
}

window.handleMakeUserAdmin = function handleMakeUserAdmin(userId, token) {
    makeUserAdmin(userId, token)
        .then(() => {
            window.location.reload()
        })
        .catch((err) => {
            alert(
                "❌ Failed to make user Admin: " +
                    (err.message || "Unknown error")
            )
            console.error(err)
        })
}

window.handleRemoveAdminFromUser = function handleRemoveAdminFromUser(
    userId,
    token
) {
    removeAdminRoleFromUser(userId, token)
        .then(() => {
            window.location.reload()
        })
        .catch((err) => {
            alert(
                "❌ Failed to remove Admin role from user: " +
                    (err.message || "Unknown error")
            )
            console.error(err)
        })
}
