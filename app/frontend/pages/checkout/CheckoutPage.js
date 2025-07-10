import { fetchCheckout } from "../../api/checkoutApiHandler.js"

export default async function CheckoutPageLoader(req, res) {
    const checkoutItems = await fetchCheckout(req.token);
    return {
        title: "CheckoutPage",
        checkoutItems: checkoutItems,
        token: req.token,
        url: "http://localhost:3000",

    }
}