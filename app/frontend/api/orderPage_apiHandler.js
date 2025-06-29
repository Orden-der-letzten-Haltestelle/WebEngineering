import config from "./config.js";
import {ApiError} from "./ApiError.js";

export async function orderHistory(token) {
    const res = await fetch(`${config.host}/cart/orders`, {
        headers: {
            Authorization: token,
        },
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.message || "Failed to fetch orderhistory"
        throw new ApiError(errorMessage, res.status, errorData)
    }
    return res.json()
}