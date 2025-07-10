import config from "./config.js"
import { ApiError } from "./ApiError.js"


export async function updateAmount(WishlistItemId, newAmount, token) {
    const res = await fetch(`${config.host}/wishlist/item/${WishlistItemId}?amount=${newAmount}`, {
        method: "PUT",
        headers: {
            Authorization: token,
        }
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.message || "Failed to fetch Update"
        throw new ApiError(errorMessage, res.status, errorData)
    }
}