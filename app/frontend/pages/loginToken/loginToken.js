import { loginWithToken } from "../../api/VerifactionApiHandler.js"

/**
 * Diese funktion läd alle daten, und returned ein object, um diese im .ejs zu laden
 *
 * @param {*} req
 * @param {*} res
 */
export default async function CartPageLoader(req, res) {
    //hier code einfügen, um inhalte dynamisch auf die seite zuladen.

    return {
        title: "Login mit Token",
    }
}