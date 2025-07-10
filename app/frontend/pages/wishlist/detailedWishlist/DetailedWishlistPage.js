import { getWishlistById } from "../../../api/WishlistApiHandler.js"

/**
 * Diese funktion läd alle daten, und returned ein object, um diese im .ejs zu laden
 *
 * @param {*} req
 * @param {*} res
 */
export default async function DetailedWishlistPageLoader(req, res) {
    //hier code einfügen, um inhalte dynamisch auf die seite zuladen.#
    const wishlistId = req.params.wishlistId
    const token = req.token
    const wishlist = await getWishlistById(wishlistId, token)
    console.log(wishlist)

    return {
        title: "DetailedWishlistPage",
        /* Hier werden die Daten der BeispielComponenten übergeben */
        wishlist: wishlist,
        token: token,
        /* Hier werden alle genutzten Componenten übergeben, damit das .css automatisch importiert wird. */
        components: [],
    }
}
