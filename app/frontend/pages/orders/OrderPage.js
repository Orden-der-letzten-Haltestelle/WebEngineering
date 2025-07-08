import {orderHistory} from "../../api/orderPage_apiHandler.js"
/**
 * Diese funktion läd alle daten, und returned ein object, um diese im .ejs zu laden
 *
 * @param {*} req
 * @param {*} res
 */
export default async function OrderPageLoader(req, res) {
    //hier code einfügen, um inhalte dynamisch auf die seite zuladen.
    const orderItems = await orderHistory(req.token);
    return {
        title: "OrderPage",
        /* Hier werden die Daten der BeispielComponenten übergeben */
        orderItems: orderItems,
        url: "http://localhost:3000",
        token: req.token,
        /* Hier werden alle genutzten Componenten übergeben, damit das .css automatisch importiert wird. */
        components: ["BeispielComponent"],
    }
}
