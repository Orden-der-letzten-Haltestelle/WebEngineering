import { getWishlists } from "../../../api/WishlistApiHandler.js"

export default async function WishlistSelectionPageLoader(req, res) {

    //hier code einfügen, um inhalte dynamisch auf die seite zuladen.
    const wishlists = await getWishlists(req.token)
    
    //filter for the wishlists where you are owner/have write access
    var wishlistsWithWriteAccess = []
    wishlists.forEach(w => {
         if(w.member.roles[0].level > 1) {
            wishlistsWithWriteAccess.push(w)
        }
    });

    return {
        title: "Wunschliste wählen",
        productId: req.params.productId,
        wishlists: wishlistsWithWriteAccess,
        token: req.token /* Hier werden die Daten der BeispielComponenten übergeben */,
        /* Hier werden alle genutzten Componenten übergeben, damit das .css automatisch importiert wird. */
    }
}
