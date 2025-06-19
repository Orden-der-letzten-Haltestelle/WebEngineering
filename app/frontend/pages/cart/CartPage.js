import express from "express"
const router = express.Router()

router.get("/", (req, res) => {
    res.render("pages/cart/CartPage", {
        cartItems: [
            {
                name: "1",
                product: {
                    price: 1999,
                },
            },
        ],
    })
})

export default router
