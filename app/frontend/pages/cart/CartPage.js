import { getToken } from "../../helper.js"

/**
 * Diese funktion läd alle daten, und returned ein object, um diese im .ejs zu laden
 *
 * @param {*} req
 * @param {*} res
 */
export default async function CartPageLoader(req, res) {
    //hier code einfügen, um inhalte dynamisch auf die seite zuladen.
    //const jwtToken = getToken()


    //load cart objects

    return {
        title: "CartPage",
        /* Hier werden die Daten der BeispielComponenten übergeben */
        beispielComponents: [
            {
                title: "1. Element",
                text: "Das ist der Text des ersten Elements",
            },
            {
                title: "2. Element",
                text: "Das ist der Text des zweiten Elements",
            },
            {
                title: "3. Element",
                text: "Das ist der Text des dritten Elements",
            },
            {
                title: "4. Element",
                text: "Das ist der Text des vierten Elements",
            },
        ],
        cartItems: [
            {
                product: {
                    name: "T-Shirt",
                },
            },
        ],
        /* Hier werden alle genutzten Componenten übergeben, damit das .css automatisch importiert wird. */
        components: ["BeispielComponent", "CartItem"],
    }
}

async function loadCart(jwtToken) {
    const url = "http://localhost:3000/api/cart"
}
