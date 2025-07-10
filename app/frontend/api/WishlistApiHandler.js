import config from "./config.js"
import { ApiError } from "./ApiError.js"

export async function getWishlists(token) {
    const res = await fetch(`${config.host}/wishlist`, {
        method: "GET",
        headers: {
            Authorization: token,
            "Content-Type": "application/json",
        },
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.message || `Failed to fetch wishlists`
        throw new ApiError(errorMessage, res.status, errorData)
    }
    return await res.json()
}

export async function createWishlist(token, name, description) {
    const res = await fetch(`${config.host}/wishlist`, {
        method: "POST",
        headers: {
            Authorization: token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            description: description,
        })
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.message || `Failed to create wishlist`
        throw new ApiError(errorMessage, res.status, errorData)
    }
    return await res.json()
}