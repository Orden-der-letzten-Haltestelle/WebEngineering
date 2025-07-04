import { ApiError } from "./ApiError.js"
import config from "./config.js"

/**
 * Fetch user information from backend
 * @param {string} token
 * @return {Promise<Object>}
 * @throws {ApiError}
 */
export async function fetchUser(token) {
    const res = await fetch(`${config.host}/auth/`, {
        headers: {
            Authorization: token,
        },
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.message || "Failed to fetch user"
        throw new ApiError(errorMessage, res.status, errorData)
    }
    return res.json()
}

export async function deleteUser(token) {
    const res = await fetch(`${config.host}/user/delete`, {
        method: "DELETE",
        headers: {
            Authorization: token,
        },
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.message || "Failed to delete user"
        throw new ApiError(errorMessage, res.status, errorData)
    }
}
