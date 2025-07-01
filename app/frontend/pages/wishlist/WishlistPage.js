/**
 * Diese funktion läd alle daten, und returned ein object, um diese im .ejs zu laden
 *
 * @param {*} req
 * @param {*} res
 */
export default async function WishlistPageLoader(req, res) {
    //hier code einfügen, um inhalte dynamisch auf die seite zuladen.
    return {
        title: "WishlistPage",
        /* Hier werden die Daten der BeispielComponenten übergeben */
        wishlist: {
            id: "3057 (wishlistid)",
            name: "Meine Wunschliste",
            description: "Tolle Wunschliste ;)",
            roles: [
                "owner",
                "write",
                "read"
            ],
            items: [
                {
                    id: "3874",
                    amount: 5,
                    addedAt: "04.05.2025",
                    product: {
                        id: "38974",
                        name: "T-Shirt",
                        description: "Tolles T-shirt",
                        amount: 100,
                        price: 1888
                    }
                },

            ],
            members: [
                {
                    userId: "3478 (userId)",
                    userWishlistRelationId: "45897 (userWishlistRealtionId)",
                    name: "Negroberd",
                    email: "negroberd@orden-der-letzten-haltestelle.de",
                    roles: [
                        "read",
                        "write"
                    ]
                }
            ]
        },
        /* Hier werden alle genutzten Componenten übergeben, damit das .css automatisch importiert wird. */
        components: ["BeispielComponent"],
    }
}
