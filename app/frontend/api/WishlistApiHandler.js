import config from "./config.js"
import { ApiError } from "./ApiError.js"

export async function getWishlistById(id, token) {
    const res = await fetch(`${config.host}/wishlist/${id}`, {
        method: "GET",
        headers: {
            Authorization: token,
            "Content-Type": "application/json",
        },
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.message || `Failed to fetch wishlist with id ${id}`
        throw new ApiError(errorMessage, res.status, errorData)
    }
    return await res.json()
}

export async function deleteWishlistItemById(id, token) {
    const res = await fetch(`${config.host}/wishlist/item/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: token,
            "Content-Type": "application/json",
        },
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.message || `Failed to delete WishlistItem with id ${id}`
        throw new ApiError(errorMessage, res.status, errorData)
    }
    return await res.json()
}