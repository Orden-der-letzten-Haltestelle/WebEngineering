//import { fetchUser } from "../../api/user"

/**
 * Diese funktion läd alle daten, und returned ein object, um diese im .ejs zu laden
 *
 * @param {*} req
 * @param {*} res
 */
export default async function ProfilePageLoader(req, res) {
    //hier code einfügen, um inhalte dynamisch auf die seite zuladen. 
    const user = await fetchUser();

    /*const user = {
        name: "test",
        email: "mail",
        roles: [
            {id: 1, rolename: "admin"}
        ]
    }*/

    return {
        name: user.name,
        mail: user.email,
        role: user.roles[0].rolename
    }
}
