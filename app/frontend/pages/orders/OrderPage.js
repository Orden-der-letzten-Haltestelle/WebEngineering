import {orderHistory} from "../../api/orderPage_apiHandler.js"
/**
 * Diese funktion läd alle daten, und returned ein object, um diese im .ejs zu laden
 *
 * @param {*} req
 * @param {*} res
 */
export default async function OrderPageLoader(req, res) {
    //hier code einfügen, um inhalte dynamisch auf die seite zuladen.
    const orderItems = await orderHistory(req.token)

    const ordersMap = new Map();

    orderItems.forEach(item => {
        const orderDate = item.boughtAt;
        const formattedDate = new Date(orderDate).toLocaleDateString('de-DE'); // Format date to 'dd.mm.yyyy'
        
        if (!ordersMap.has(orderDate)) {
            ordersMap.set(orderDate, { formattedDate, items: [] });
        }
        
        const order = ordersMap.get(orderDate);
        order.items.push(item);
    });

    const orders = Array.from(ordersMap.entries())
        .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
        .map(([date, { formattedDate, items }]) => ({ formattedDate, items }));

    console.log(orders)
    return {
        title: "OrderPage",
        /* Hier werden die Daten der BeispielComponenten übergeben */
        orders: orders,
        url: "http://localhost:3000",
        token: req.token,
        /* Hier werden alle genutzten Componenten übergeben, damit das .css automatisch importiert wird. */
        components: ["BeispielComponent"],
    }
}
