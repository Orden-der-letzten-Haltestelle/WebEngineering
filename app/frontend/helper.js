export function isTokenGiven() {
    return document.cookie
        .split(";")
        .some((cookie) => cookie.trim().startsWith("token="))
}
