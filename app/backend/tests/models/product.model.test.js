import Product from "../../src/objects/items/Product.js"
import { jest } from "@jest/globals"

//mocked data
const mockProductsData = [
    {
        id: 1,
        name: "Produkt 1",
        description: "Beschreibung 1",
        amount: 10,
        price: 1888,
    },
    {
        id: 2,
        name: "Produkt 2",
        description: "Beschreibung 2",
        amount: 20,
        price: 1999,
    },
]

// mock pool
jest.unstable_mockModule("../../src/models/pool.js", () => ({
    pool: {
        query: jest.fn().mockResolvedValue({ rows: mockProductsData }),
    },
}))

//imports after mockup setup
const ProductModel = await import("../../src/models/product.model.js")
const { pool } = await import("../../src/models/pool.js")

// Tests findAllProducts
describe("Test findAllProducts", () => {
    it("goodcase01", async () => {
        const products = await ProductModel.default.findAllProducts()

        // proof that return is as expected
        expect(products).toEqual(
            mockProductsData.map(
                (p) =>
                    new Product(p.id, p.name, p.description, p.amount, p.price)
            )
        )

        // Proof if query go executed as expected
        expect(pool.query).toHaveBeenCalledWith(
            "SELECT * FROM webshop.products"
        )
    })
})
