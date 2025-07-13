import config from "./config.js"
import { ApiError } from "./ApiError.js"

export async function getAllUsers(token) {
    const res = await fetch(`${config.host}/user/allUsers`, {
        method: "GET",
        headers: {
            Authorization: token,
            "Content-Type": "application/json",
        },
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.message || `Failed to fetch all users`
        throw new ApiError(errorMessage, res.status, errorData)
    }
    return await res.json()
}

export async function bannUser(userId, token) {
    const res = await fetch(`${config.host}/user/${userId}/bann`, {
        method: "PUT",
        headers: {
            Authorization: token,
            "Content-Type": "application/json",
        },
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage =
            errorData.message || `Failed to bann user with id ${userId}`
        throw new ApiError(errorMessage, res.status, errorData)
    }
}

export async function unbannUser(userId, token) {
    const res = await fetch(`${config.host}/user/${userId}/unbann`, {
        method: "PUT",
        headers: {
            Authorization: token,
            "Content-Type": "application/json",
        },
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage =
            errorData.message || `Failed to unbann user with id ${userId}`
        throw new ApiError(errorMessage, res.status, errorData)
    }
}

export async function makeUserAdmin(userId, token) {
    const res = await fetch(`${config.host}/user/${userId}/role/makeAdmin`, {
        method: "PUT",
        headers: {
            Authorization: token,
            "Content-Type": "application/json",
        },
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage =
            errorData.message || `Failed to make user with id ${userId} admin`
        throw new ApiError(errorMessage, res.status, errorData)
    }
}

export async function removeAdminRoleFromUser(userId, token) {
    const res = await fetch(`${config.host}/user/${userId}/role/makeNoAdmin`, {
        method: "PUT",
        headers: {
            Authorization: token,
            "Content-Type": "application/json",
        },
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage =
            errorData.message || `Failed to remove admin role from user with id ${userId}`
        throw new ApiError(errorMessage, res.status, errorData)
    }
}

export async function deleteUserAdmin(userId, token) {
    console.log(token)
    const res = await fetch(`${config.host}/user/byId/delete/${userId}`, {
        method: "DELETE",
        headers: {
            Authorization: token,
            "Content-Type": "application/json",
        },
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage =
            errorData.message || `Failed to delete user with id ${userId}`
        throw new ApiError(errorMessage, res.status, errorData)
    }
}