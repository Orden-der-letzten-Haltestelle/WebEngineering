import config from "./config.js"
import { ApiError } from "./ApiError.js"

export async function fetchCart(token) {
    const res = await fetch(`${config.host}/cart/`, {
        headers: {
            Authorization: token,
        },
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.message || "Failed to fetch cart"
        throw new ApiError(errorMessage, res.status, errorData)
    }
    return res.json()
}

export async function updateAmount(cartItemId, newAmount, token) {
    const res = await fetch(`${config.host}/cart/item/${cartItemId}?amount=${newAmount}`, {
        method: "PUT",
        headers: {
            Authorization: token,
        }
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.message || "Failed to fetch cart"
        throw new ApiError(errorMessage, res.status, errorData)
    }
}

export async function deleteCartItem(cartItemId, token) {
    const res = await fetch(`${config.host}/cart/item/${cartItemId}`, {
        method: "DELETE",
        headers: {
            Authorization: token,
        }
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.message || "Failed to delete cartItem"
        throw new ApiError(errorMessage, res.status, errorData)
    }
}

export async function deleteCart(token) {
    const res = await fetch(`${config.host}/cart`, {
        method: "DELETE",
        headers: {
            Authorization: token
        }
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.message || "Failed to delete cart"
        throw new ApiError(errorMessage, res.status, errorData)
    }
}