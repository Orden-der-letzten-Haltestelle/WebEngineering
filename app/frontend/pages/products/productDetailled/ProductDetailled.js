import { fetchProductById } from "../../../api/productDetailledApiHandler.js"

export default async function ProductDetailledLoader({ params }) {
  console.log("here")
  const productId = params.productId;
  console.log(productId)
  const product = await fetchProductById(productId);
  console.log(product)

  return {
    title: product.name,
    product: product
  };
}
