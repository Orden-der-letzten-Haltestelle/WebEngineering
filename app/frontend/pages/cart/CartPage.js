import express from "express"
const router = express.Router()

//loading cartPage
router.get("/", (req, res) => {
    res.render("pages/cart/CartPage", {
        cartItems: [
            {
                product: {
                    name: "1",
                    price: 1999,
                },
            },
        ],
    })
})

export default router
