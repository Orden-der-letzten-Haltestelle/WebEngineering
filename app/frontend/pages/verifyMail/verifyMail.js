import { verifyUser } from "../../api/VerifactionApiHandler.js"

/**
 * Diese funktion läd alle daten, und returned ein object, um diese im .ejs zu laden
 *
 * @param {*} req
 * @param {*} res
 */
export default async function CartPageLoader(req, res) {
    //hier code einfügen, um inhalte dynamisch auf die seite zuladen.

    const apiRequest = await verifyUser(req.params.token)

    return {
        title: "Verifzieren der Mail",
    }
}