import { fetchProductById } from "../../../api/productApiHandler.js"

export default async function ProductDetailledLoader(req, res) {
  const productId = req.params.productId;
  const product = await fetchProductById(productId);

  //proof if admin is connected 
  const isAdmin = req?.user?.isAdmin
console.log(req.user)


  return {
    title: product.name,
    product: product,
    isAdmin: isAdmin
  };
}
