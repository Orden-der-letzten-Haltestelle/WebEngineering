/**
 * Diese funktion läd alle daten, und returned ein object, um diese im .ejs zu laden
 *
 * @param {*} req
 * @param {*} res
 */
import http from 'http';

function fetchProducts(){
    return new Promise((resolve, reject) => {
        http.get('http://localhost:3000/api/products', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try{
                    const parsed = JSON.parse(data);
                    resolve(parsed);
                }catch(err){
                    reject(err);
                }
            });
        }).on('error', reject);
    });
}
export default async function ProductPageLoader(req, res) {
    //hier code einfügen, um inhalte dynamisch auf die seite zuladen.
    const response = await fetch('http://localhost:3000/api/products');
    const product = await response.json();

    return {
        title: "ProductPage",
        product, /* Hier werden die Daten der BeispielComponenten übergeben */
        beispielComponents: [
            {
                title: "1. Element",
                text: "Das ist der Text des ersten Elements",
            },
            {
                title: "2. Element",
                text: "Das ist der Text des zweiten Elements",
            },
            {
                title: "3. Element",
                text: "Das ist der Text des dritten Elements",
            },
            {
                title: "4. Element",
                text: "Das ist der Text des vierten Elements",
            },
        ],
        /* Hier werden alle genutzten Componenten übergeben, damit das .css automatisch importiert wird. */
        components: ["BeispielComponent"],
    }
}
