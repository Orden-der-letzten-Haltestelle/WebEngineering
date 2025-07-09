import { getWishlists } from "../../../api/WishlistApiHandler.js"

/**
 * Diese funktion läd alle daten, und returned ein object, um diese im .ejs zu laden
 *
 * @param {*} req
 * @param {*} res
 */
export default async function WishlistOverviewPageLoader(req, res) {
    //hier code einfügen, um inhalte dynamisch auf die seite zuladen.
    const wishlists = await getWishlists(req.token)
        return {
            title: "Wunschlisten Übersicht",
            token: req.token,
            wishlists: wishlists,
            url: "http://localhost:3000",
            /* Hier werden alle genutzten Componenten übergeben, damit das .css automatisch importiert wird. */
            components: ["wishlists"],
        }
}