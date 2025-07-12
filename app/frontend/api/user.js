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

export async function fetchUserByEmail(token, email) {
    const res = await fetch(`${config.host}/user/userByMail/${email}`, {
        method: "GET",
        headers: {
            Authorization: token,
            "Content-Type": "application/json",
        },
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.message || `Failed to get User By email`
        throw new ApiError(errorMessage, res.status, errorData)
    }
    return await res.json()
}
