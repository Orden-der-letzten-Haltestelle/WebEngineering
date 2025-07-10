import config from "./config.js"
import { ApiError } from "./ApiError.js"

export async function verifyUser(token) {
    const res = await fetch(`${config.host}/auth/verify/${token}`, {
        method: "PUT",
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.message || "Failed to verify user"
        throw new ApiError(errorMessage, res.status, errorData)
    }
}

export async function loginWithToken(token) {
    const res = await fetch(`${config.host}/auth/login/${token}`, {
        method: "PUT",
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.message || "Failed to verify user"
        throw new ApiError(errorMessage, res.status, errorData)
    }
    return await res.json()
}