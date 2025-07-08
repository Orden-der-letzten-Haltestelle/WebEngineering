import { fetchProductById } from "../../../api/productDetailledApiHandler.js"

export default async function ProductDetailledLoader(req, res) {
  const productId = params.productId;
  const product = await fetchProductById(productId);

  return {
    title: product.name,
    product: product
  };
}
