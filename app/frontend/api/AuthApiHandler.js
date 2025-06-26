import config from "./config.js"
import { ApiError } from "./ApiError.js"

export async function registerUser(username, email, password){
    const res = await fetch(`${config.host}/auth/register`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password
        })
    })
    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.message || "Failed to fetch cart"
        throw new ApiError(errorMessage, res.status, errorData)
    }
    return await res.json()
}