import { getAllUsers } from "../../../api/AdminApiHandler.js"

/**
 * Diese funktion läd alle daten, und returned ein object, um diese im .ejs zu laden
 *
 * @param {*} req
 * @param {*} res
 */
export default async function UserManagerPageLoader(req, res) {
    //hier code einfügen, um inhalte dynamisch auf die seite zuladen.
    const users = await getAllUsers(req.token)

    return {
        title: "AdminPage",
        token: req.token,
        users: users,
        url: "http://localhost:3000",
        /* Hier werden alle genutzten Componenten übergeben, damit das .css automatisch importiert wird. */
        components: ["AdminPageUserItem"],
    }
}
