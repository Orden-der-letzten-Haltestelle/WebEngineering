import { fetchCart } from "../../api/CartApiHandler.js"

/**
 * Diese funktion läd alle daten, und returned ein object, um diese im .ejs zu laden
 *
 * @param {*} req
 * @param {*} res
 */
export default async function AdminPageLoader(req, res) {
    //hier code einfügen, um inhalte dynamisch auf die seite zuladen.

    return {
        title: "AdminPage",
        token: req.token,
        users: [
            {
                id: 1,
                name: "admin",
                email: "admin@letzteHaltestelle.de",
                createdAt: "2025-06-08T13:06:11.188Z",
                isVerified: true,
                isBanned: false,
                roles: ["user", "admin"],
            },
            {
                id: 2,
                name: "moritz",
                email: "moritz@letzteHaltestelle.de",
                createdAt: "2025-06-08T13:06:11.188Z",
                isVerified: true,
                isBanned: false,
                roles: ["user"],
            },
        ],
        url: "http://localhost:3000",
        /* Hier werden alle genutzten Componenten übergeben, damit das .css automatisch importiert wird. */
        components: ["AdminPageUserItem"],
    }
}
