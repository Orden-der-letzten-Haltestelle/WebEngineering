import config from "./config.js"
import { ApiError } from "./ApiError.js"

export async function registerUser(username, email, password) {
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
        const errorMessage = errorData.message || "Failed to register user"
        throw new ApiError(errorMessage, res.status, errorData)
    }
    return await res.json()
}

export async function logInUser(email, password) {
    const res = await fetch(`${config.host}/auth/login`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.message || "Failed to login"
        throw new ApiError(errorMessage, res.status, errorData)
    }
    return await res.json()
}

export async function SendVerifyMail(email){
    const res = await fetch(`${config.host}/auth/verify/sendmail`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email
        })
    })
    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.message || "Failed to login"
        throw new ApiError(errorMessage, res.status, errorData)
    }
    return await res.json()
}

export async function SendSignInMail(email) {
    const res = await fetch(`${config.host}/auth/login/sendmail`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email
        })
    })
    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.message || "Failed to login"
        throw new ApiError(errorMessage, res.status, errorData)
    }
    return await res.json()
}