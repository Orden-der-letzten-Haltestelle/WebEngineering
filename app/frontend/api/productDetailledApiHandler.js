import { ApiError } from "./ApiError.js"
import config from "./config.js"

/**
 * Fetch products information from backend
 * @param {string} token
 * @return {Promise<Object>}
 * @throws {ApiError}
 */

export async function fetchProductById(productId) {
    const res = await fetch(`/products/${productId}`);
    if (!res.ok) throw new Error("Produkt konnte nicht geladen werden");
    return await res.json();
}