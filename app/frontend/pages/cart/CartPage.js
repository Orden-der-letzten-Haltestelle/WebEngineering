import { fetchCart } from "../../api/CartApiHandler.js"

/**
 * Diese funktion läd alle daten, und returned ein object, um diese im .ejs zu laden
 *
 * @param {*} req
 * @param {*} res
 */
export default async function CartPageLoader(req, res) {
    //hier code einfügen, um inhalte dynamisch auf die seite zuladen.

    //load cart
    const cartItems = await fetchCart(req.token)

    return {
        title: "CartPage",
        /* Hier werden die Daten der BeispielComponenten übergeben */
        cartItems: cartItems,
        token: req.token,
        /* Hier werden alle genutzten Componenten übergeben, damit das .css automatisch importiert wird. */
        components: ["CartItem"],
    }
}

export function test() {
    console.log("here")
}
