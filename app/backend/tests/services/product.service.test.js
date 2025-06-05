import ProductModel from "../../src/models/product.model.js"
import ProductService from "../../src/services/product.service.js"
import { jest } from "@jest/globals"

describe("Test ProductService", () => {
    describe("getAllProducts", () => {
        it("goodcase01: should return all products from the database", async () => {
            // Mock data
            const mockProducts = [
                { id: 1, name: "Product 1" },
                { id: 2, name: "Product 2" },
            ]

            // Mock findAllProducts function
            jest.spyOn(ProductModel, "findAllProducts").mockReturnValueOnce(
                mockProducts
            )

            // call the method
            const result = await ProductService.getAllProducts()

            // Test result
            expect(result).toEqual(mockProducts)

            // Restore the original implementation
            ProductModel.findAllProducts.mockRestore()
        })
    })
})
