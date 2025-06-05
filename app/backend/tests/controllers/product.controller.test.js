import ProductController from "../../src/controllers/product.controller.js"
import DatabaseError from "../../src/exceptions/DatabaseError.js"
import ProductService from "../../src/services/product.service.js"
import { jest } from "@jest/globals"

describe("Test ProductController", () => {
    describe("listProducts", () => {
        let req, res

        beforeEach(() => {
            // Mock Express req and res objects
            req = {}
            res = {
                writeHead: jest.fn(),
                end: jest.fn(),
            }
        })

        afterEach(() => {
            jest.restoreAllMocks()
        })

        it("should respond with status 200 and JSON data when products are retrieved successfully", async () => {
            const mockProducts = [
                { id: 1, name: "Product 1" },
                { id: 2, name: "Product 2" },
            ]

            // Mock the service method to return products
            jest.spyOn(ProductService, "getAllProducts").mockResolvedValue(
                mockProducts
            )

            await ProductController.listProducts(req, res)

            expect(ProductService.getAllProducts).toHaveBeenCalled()

            // Expect res.writeHead to be called with 200 and content-type json
            expect(res.writeHead).toHaveBeenCalledWith(200, {
                "Content-Type": "application/json",
            })

            // Expect res.end to be called with the stringified products
            expect(res.end).toHaveBeenCalledWith(JSON.stringify(mockProducts))
        })

        it("should respond with status 500 and error message when the service throws", async () => {
            // Mock the service method to throw an error
            jest.spyOn(ProductService, "getAllProducts").mockRejectedValue(
                new Error("DB error")
            )

            // Spy on console.error to silence error logs in test output
            jest.spyOn(console, "error").mockImplementation(() => {})

            await ProductController.listProducts(req, res)

            expect(ProductService.getAllProducts).toHaveBeenCalled()

            // Expect res.writeHead to be called with 500 and plain text
            expect(res.writeHead).toHaveBeenCalledWith(500, {
                "Content-Type": "text/plain",
            })

            // Expect res.end to be called with error message
            expect(res.end).toHaveBeenCalledWith("Interner Server Fehler")

            console.error.mockRestore()
        })
    })
})
