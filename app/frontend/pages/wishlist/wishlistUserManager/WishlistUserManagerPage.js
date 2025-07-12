import { getWishlistById } from "../../../api/WishlistApiHandler.js"

/**
 * Diese funktion läd alle daten, und returned ein object, um diese im .ejs zu laden
 *
 * @param {*} req
 * @param {*} res
 */
export default async function WishlistUserManagerPageLoader(req, res) {
    //hier code einfügen, um inhalte dynamisch auf die seite zuladen.
    const wishlistId = req.params.wishlistId
    const token = req.token
    const wishlist = await getWishlistById(wishlistId, token)

    return {
        title: "WishlistUserManager",
        wishlist: wishlist,
        members: wishlist.members,
        token: token,
        components: ["WishlistMember"],
    }
}
