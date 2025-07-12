/**
 * Diese funktion läd alle daten, und returned ein object, um diese im .ejs zu laden
 *
 * @param {*} req
 * @param {*} res
 */
export default async function CreateProductPageLoader(req, res) {
    //hier code einfügen, um inhalte dynamisch auf die seite zuladen.

    return {
        title: "CreateProductPage",
        token: req.token,
        url: "http://localhost:3000",
        /* Hier werden alle genutzten Componenten übergeben, damit das .css automatisch importiert wird. */
        components: [],
    }
}
