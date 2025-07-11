import { fetchProducts } from "../../../api/productApiHandler.js"

export default async function ProductPageLoader(req, res) {
    const { value = "", minPrice = "", maxPrice = "" } = req.query

    //hier code einfügen, um inhalte dynamisch auf die seite zuladen.
    const products = await fetchProducts(value, minPrice, maxPrice)


    return {
        title: "ProductPage",
        products: products,
        token: req.token,
        /* Hier werden alle genutzten Componenten übergeben, damit das .css automatisch importiert wird. */
        components: []
    }
}
