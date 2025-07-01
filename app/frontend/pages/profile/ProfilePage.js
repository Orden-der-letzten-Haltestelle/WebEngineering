import { fetchUser } from "../../api/user.js"
import { getToken } from "../../helper.js";

/**
 * Diese funktion läd alle daten, und returned ein object, um diese im .ejs zu laden
 *
 * @param {*} req
 * @param {*} res
 */
export default async function ProfilePageLoader(req, res) {
    //hier code einfügen, um inhalte dynamisch auf die seite zuladen.
    const token = getToken(req)
    const user = await fetchUser(token);
    console.log("Test", user.authUser.name)

    /*const user = {
        name: "test",
        email: "mail",
        roles: [
            {id: 1, rolename: "admin"}
        ]
    }*/

    const nRoles = user.authUser.roles.length

    return {
        name: user.authUser.name,
        mail: user.authUser.email,
        role: user.authUser.roles[nRoles - 1]
    }
}
