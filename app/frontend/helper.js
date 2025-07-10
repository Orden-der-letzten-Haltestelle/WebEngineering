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
 * Shows a Toast Message instead of an alert
 * Since alerts are ugly
 * @param {*} message any
 * @param {*} type error or success
 */
export function showToast(message, type = "error") {
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}