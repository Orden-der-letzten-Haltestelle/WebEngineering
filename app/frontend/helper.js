/**
 * Checks if a token is given in the cookies from document (works only if page already loaded)
 * @returns
 */
export function isTokenGiven() {
    return document.cookie
        .split(";")
        .some((cookie) => cookie.trim().startsWith("token="))
}

/**
 * Returns the jwt token stored in the cookies, extract it from the req
 * @returns
 */
export function getToken(req) {
    return req.cookies?.token || null
}



/**
 * Returns if user is an admin
 * @returns
**/ 
export function isUserAdmin(token) {
    return document.cookie
        .split(";")
        .some((cookie) => cookie.trim().startsWith("admin="))
}