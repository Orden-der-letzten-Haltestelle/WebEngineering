import config from "./config.js"
import { ApiError } from "./ApiError.js"

export async function fetchCheckout(token) {
    const res = await fetch(`${config.host}/cart/`, {
        headers: {
            Authorization: token,
        },
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.message || "Failed to fetch checkout"
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
        const errorMessage = errorData.message || "Failed to update amount"
        throw new ApiError(errorMessage, res.status, errorData)
    }
}
