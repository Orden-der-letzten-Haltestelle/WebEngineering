import { getWishlists } from "../../../api/wishlistApiHandler.js"

export default async function WishlistSelectionPageLoader(req, res) {

    //hier code einfügen, um inhalte dynamisch auf die seite zuladen.
    const wishlists = await getWishlists(req.token)
    console.log(req.params.productId)

    return {
        title: "Wunschliste wählen",
        productId: req.params.productId,
        wishlists: wishlists,
        token: req.token /* Hier werden die Daten der BeispielComponenten übergeben */,
        /* Hier werden alle genutzten Componenten übergeben, damit das .css automatisch importiert wird. */
    }
}