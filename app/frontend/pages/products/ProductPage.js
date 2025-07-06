import { fetchProducts } from "../../api/productApiHandler.js"

export default async function ProductPageLoader(req, res) {
    //hier code einfügen, um inhalte dynamisch auf die seite zuladen.
    const products = await fetchProducts();
    

    
    return {
        title: "ProductPage",
        products: products, /* Hier werden die Daten der BeispielComponenten übergeben */
        token: req?.token
        /* Hier werden alle genutzten Componenten übergeben, damit das .css automatisch importiert wird. */
    }
}
