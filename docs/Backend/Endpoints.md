# 📍 Endpoints

We have two different kinds of Roles. We have the webshop roles `admin` and `user` and also custome roles for wishlists: `owner`, `write` and `read`.

Usefull link for Routing using Express: [Routing](https://expressjs.com/en/guide/routing.html)

## 📋 Needed Endpoints

| Action | Endpoint                                 | Role  | Payload    | Description                                |
| ------ | ---------------------------------------- | ----- | ---------- | ------------------------------------------ |
| GET    | `/api/products?name={name}&minPrice={x}&maxPrice={y}` | user  |            | All products in Price Range and including the name             |
| GET    | `/api/product/:productId`                       | user  |            | Single product                             |
| POST   | `/api/product`                           | admin | 📝 Product  | Create a product (name, description, amount, price)                          |
| PUT    | `/api/product/:productId`                       | admin | 📝 Product  | Update a product (name, description, amount, price)                    |
| DELETE | `/api/product/:productId`                       | admin | ❌          | Delete a product                           |
| GET    | `/api/cart`                              | user  |            | All products in own Cart                   |
| DELETE | `/api/cart`                              | user  | ❌          | Delete all products of Cart                |
| POST   | `/api/cart/product/:productId?amount={amount}`                      | user  | 🖱️ | Add product to Cart Amount is optional will be set on 1 if not given.|
| PUT    | `/api/cart/item/:cartItemId?amount={amount}`                  | user  | 📝 | Change amount of product in your cart                   |
| DELETE | `/api/cart/item/:cartItemId`                  | user  | ❌          | Remove product from Cart                   |
| POST   | `/api/cart/buy`                          | user  | 🖱️  | Moves products of Cart into Order          |
| GET    | `/api/cart/orders`                             | user  |            | Shows all ordered products                 |
| GET    | `/api/wishlist`                          | read  |            | All your Wishlists                         |
| GET    | `/api/wishlist/:wishlistId`                      | read  |            | Single Wishlist (with all items in it)                           |
| POST   | `/api/wishlist`                          | owner | 📝 Wishlist | Create a Wishlist                          |
| PUT    | `/api/wishlist/:wishlistId`                      | write | 📝 Wishlist | Update Wishlist (name, desc.)              |
| DELETE | `/api/wishlist/:wishlistId` | owner | | Löscht eine Wunschliste
| POST   | `/api/wishlist/:wishlistId/item?productId={...} `                 | write | 🖱️ | Add a product to a Wishlist (amount = 1)   |
| PUT    | `/api/wishlist/item/:wishlistItemId?amount={amount}`                 | write | 📝 | Change amount of product                   |
| DELETE | `/api/wishlist/item/:wishlistItemId`                 | write | ❌          | Remove product from Wishlist               |
| POST   | `/api/wishlist/:wishlistId/permission`               | owner | 📝 WishlistMemeber     | Add a user to a selected Wishlist Payload hat userId und rollen des jeweiligen nutzers          |
| PUT    | `/api/wishlist/permission/:userWishlistRelationId`           | owner | 📝 Role     | Change role of a user                      |
| DELETE | `/api/wishlist/permission/:userWishlistRelationId`           | owner | ❌          | Delete user from wishlist                  |
| POST   | `/api/auth/register`                     |       | 📝 User     | Register a user                            |
| POST   | `/api/auth/login`                        | user  | 📝 User     | Login of user                              |
| POST   | `/api/auth/login?email={email}`          | user  | 📝 Email    | Login with only Email and a Link to verify |
| GET    | `/api/auth/renew`                        | user  |             | Erneuert den JWT token
| POST   | `/api/auth/logout`                       | user  | 🖱️          | Logout of current user (einfach token löschen im frontend)                    |
| PUT    | `/api/auth/verify?token={...}`           | user  |            | verification with email                   |
| GET    | `/api/user`                              | user  |            | Returns your User                          |
| GET    | `/api/user/userByMail/{email}`                        | user |            | Returns one user with matching email                         |
| GET    | `/api/user/userById/:userId`                          | admin            | Returns an User by Id                      |
| GET    | `/api/user/allUsers`                          | admin            | Returns all Users                     |
| PUT    | `/api/user/:userId/bann`                     | admin | 🖱️          | Banns the User                             |
| PUT    | `/api/user/:userId/unbann`                   | admin | 🖱️          | Unbanns the User                           |
| PUT    | `/api/user/:userId/role/makeAdmin`                     | admin |    | Change the Role of the User                |
| PUT    | `/api/user/:userId/role/makeNoAdmin`                     | admin |    | Change the Role of the User                |
| DELETE | `/api/user/delete`                       | user | ❌          | Delete your own account                           |
| DELETE | `/api/user/byId/delete/:userId`                       | admin | ❌          | Delete the account with the given id                           |

Legend
| Logo | Description           |
| ---- | --------------------- |
| 📝    | Input via a Form      |
| 🖱️    | Input via a Button    |
| ❌    | Deletion via a Button |

## 🧾 Details for each Endpoints

will be implemented