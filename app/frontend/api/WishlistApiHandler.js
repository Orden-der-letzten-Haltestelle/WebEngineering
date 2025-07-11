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
        const errorMessage =
            errorData.message || `Failed to fetch wishlist with id ${id}`
        throw new ApiError(errorMessage, res.status, errorData)
    }
    return await res.json()
}

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

export async function updateWishlistItemAmount(id, amount, token) {
    const res = await fetch(
        `${config.host}/wishlist/item/${id}?amount=${amount}`,
        {
            method: "PUT",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
            },
        }
    )

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage =
            errorData.message ||
            `Failed to update WishlistItem amount with id ${id}`
        throw new ApiError(errorMessage, res.status, errorData)
    }
    return await res.json()
}

export async function createWishlist(token, name, description) {
    const res = await fetch(`${config.host}/wishlist/`, {
        method: "POST",

        headers: {
            Authorization: token,
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            name: name,
            description: description,
        }),
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.message || `Failed to create wishlist`
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
        const errorMessage =
            errorData.message || `Failed to delete WishlistItem with id ${id}`
        throw new ApiError(errorMessage, res.status, errorData)
    }
    return await res.json()
}

export async function updateWishlistInfo(id, token, name, description) {
    const res = await fetch(`${config.host}/wishlist/${id}`, {
        method: "PUT",
        headers: {
            Authorization: token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            description: description,
        }),
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage =
            errorData.message || `Failed to update Wishlist Info with id ${id}`
        throw new ApiError(errorMessage, res.status, errorData)
    }
    return await res.json()
}

export async function deleteWishlist(token, wishlistId) {
    const res = await fetch(`${config.host}/wishlist/${wishlistId}`, {
        method: "DELETE",
        headers: {
            Authorization: token,
            "Content-Type": "application/json",
        },
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.message || `Failed to delete wishlist`
        throw new ApiError(errorMessage, res.status, errorData)
    }
    return await res.json()
}

export async function updateWishlistMemberRole(
    token,
    userWishlistRelationId,
    newRoleLevel
) {
    const res = await fetch(
        `${config.host}/wishlist/permission/${userWishlistRelationId}`,
        {
            method: "PUT",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                roleLevel: newRoleLevel,
            }),
        }
    )

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage =
            errorData.message || `Failed to update WishlistMemberRole`
        throw new ApiError(errorMessage, res.status, errorData)
    }
    return await res.json()
}

export async function deleteWishlistMember(token, userWishlistRelationId) {
    console.log(token)
    const res = await fetch(
        `${config.host}/wishlist/permission/${userWishlistRelationId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
            },
        }
    )

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage =
            errorData.message || `Failed to delete WishlistMember`
        throw new ApiError(errorMessage, res.status, errorData)
    }
    return await res.json()
}

export async function addWishlistMember(token, wishlistId, userId, roleLevel) {
    
    const res = await fetch(
        `${config.host}/wishlist/${wishlistId}/permission`,
        {
            method: "POST",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: userId,
                roleLevel: roleLevel,
            }),
        }
    )

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.message || `Failed to add WishlistMember`
        throw new ApiError(errorMessage, res.status, errorData)
    }
    return await res.json()
}
