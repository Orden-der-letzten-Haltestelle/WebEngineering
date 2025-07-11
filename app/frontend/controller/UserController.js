import { deleteUser } from "../api/user.js"
import { showToast } from "../helper.js"

window.handleDeleteUser = function handleDeleteUser(token) {
    deleteUser(token)
        .then(() => {
            document.cookie =
                "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;"
        })
        .catch((err) => {
            showToast("❌ Failed to delete User: " + (err.message || "Unknown error"))
            console.error(err)
        })
}
