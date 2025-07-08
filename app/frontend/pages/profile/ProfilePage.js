/**
 * Diese funktion läd alle daten, und returned ein object, um diese im .ejs zu laden
 *
 * @param {*} req
 * @param {*} res
 */
export default async function ProfilePageLoader(req, res) {
    //hier code einfügen, um inhalte dynamisch auf die seite zuladen.
    const token = req.token
    const user = req.user
    const nRoles = user.roles.length

    return {
        token: token,
        user: user,
        name: user.name,
        mail: user.email,
        role: user.roles[nRoles - 1],
    }
}
