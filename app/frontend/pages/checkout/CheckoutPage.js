import { fetchCart } from "../../api/CartApiHandler.js"

export default async function CheckoutPageLoader(req, res) {
    //hier code einfügen, um inhalte dynamisch auf die seite zuladen.
    const cartItems = await fetchCart(req.token);
    return {
        title: "CheckoutPage",
        cartItems: cartItems,
    }
}
