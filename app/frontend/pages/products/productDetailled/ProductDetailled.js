import { fetchProductById } from "../../../api/productDetailledApiHandler.js"

export default async function ProductDetailledLoader(req, res) {
    //hier code einfügen, um inhalte dynamisch auf die seite zuladen.
    const productId = await fetchProductById(productId);

    return {
        title: "ProductDetailled",
        products: productId /* Hier werden die Daten der BeispielComponenten übergeben */
        /* Hier werden alle genutzten Componenten übergeben, damit das .css automatisch importiert wird. */
    }
}
