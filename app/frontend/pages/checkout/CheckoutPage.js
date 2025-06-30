import { fetchCart } from "../../api/CartApiHandler.js"

export default async function CheckoutPageLoader(req, res) {
    //hier code einfügen, um inhalte dynamisch auf die seite zuladen.
    const products = await fetchCart();
    return {
        title: "CheckoutPage",
        products: products,
    }
}
