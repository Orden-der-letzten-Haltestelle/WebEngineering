/**
 * Diese funktion läd alle daten, und returned ein object, um diese im .ejs zu laden
 *
 * @param {*} req
 * @param {*} res
 */
export default async function WishlistUserManagerPageLoader(req, res) {
    //hier code einfügen, um inhalte dynamisch auf die seite zuladen.

    return {
        title: "WishlistUserManager",
        /* Hier werden die Daten der BeispielComponenten übergeben */
        /* Hier werden alle genutzten Componenten übergeben, damit das .css automatisch importiert wird. */
        components: [],
    }
}
