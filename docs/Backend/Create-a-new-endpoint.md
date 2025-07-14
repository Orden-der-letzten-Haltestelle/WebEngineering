# Routes
Definiere den Endpunkt in der Datei `app/backend/src/routes/*.routes.js`
Als Pfad muss nur der Teil des Pfads innerhalb des Services angegeben werden, da in der index.js die Anfrage bereits dem richtigen Service zugeordnet wird.
index.js:
```javascript
app.use("/api/auth", AuthRouter)
```
 
Bsp.:
```javascript
import AuthController from "../controllers/auth.controller.js"

router.post("/register", AuthController.register)
```

## Secure Endpoint
Sollte überprüft werden, ob ein JWT token vorhanden ist, kann die Funktion aufgerufen werden. Diese überprüft den JWT token und extrahiert die Informationen und speichert sie in req.user
Desweiteren kann dieser function ein optionaler Parameter 'requiredRole' übergeben werden. Durch welchen nur Nutzer zugelassen werden, die die jeweilige Rolle haben.

```javascript
import Roles from "../objects/user/Roles.js"
import AuthController from "../controllers/auth.controller.js"

router.get("/protected", AuthController.verifyJWTtoken(Roles.user), (req, res) => {
    res.send(
        `You have been granted access; userId: ${req.user.id}, roles: ${req.user.roles}`
    )
})
```

# Controller
Im Router wird eine Funktion definiert/aufgerufen. Diese sollte in der Datei `app/backend/src/controllers/*.controllers.js` definiert sein.
Hier werden Parameter aus der Anfrage extrahiert und die Antwort zurück an den client aufgebaut und abgeschickt.

```javascript
import AuthService from "../services/auth.service.js"

async function listProducts(req, res) {
    try {
        const products = await ProductService.getAllProducts()

        const data = JSON.stringify(products)

        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(data)
    } catch (error) {
        console.error(error.stack);
        res.writeHead(error.statusCode, { "Content-Type": "text/plain" });
        res.end(error.stack + (error.cause ? "\n\n[cause] " + error.cause : ""));
    }
}
```

# Service 
Im Service sollte die Logik sein, wie bspw. kontrollieren, ob die angegebenen Parameter den Anforderungen entsprechen.

```javascript
import AuthValidator from "../validator/validator.auth.js"
import AuthModel from "../models/auth.model.js"

/**
 * Create a User in the DB, hashes the password and sends out an Email
 * @param {string} username
 * @param {string} password
 * @param {string} email
 * @returns {Promise<Object>} [user, jwt]
 */
async function createUser(username, password, email) {
    //verify, that email and password are fitting requirements.
    AuthValidator.isSecurePassword(password)
    await AuthValidator.isValidEmail(email)

    //hash password
    const hashedPassword = await bcrypt.hash(password, PASSWORD_HASH_SALT)

    //create user
    const user = await AuthModel.createUser(username, hashedPassword, email)

    // TODO Send out the Email if succesfull

    //generate jwtToken
    const jwt = generateJWTtoken(user)
    return {
        user: user,
        jwt: jwt,
    }
}
```

# validator 
Hier sollten Überprüfungen definiert sein, wie z.B. ob ein password die richtige Länge hat.

```javascript
import authModel from "../models/auth.model.js"

/**
 * Validate, that the password fit the requirements, throws error when not
 * @param {string} password
 */
function isSecurePassword(password) {
    if (password.length !== MIN_PASSWORD_LENGTH) {
        throw new BadRequestError(
            `Given Password doesn't fit requirments, password needs at least ${MIN_PASSWORD_LENGTH} Characters.`
        )
    }
    return true
}
```


# Model
In diesem file sollten alle Datenbankzugriffe definiert sein. 

```javascript
/**
 * returnes true or false, based on if a user with that email exist.
 * @param {string} email
 * @returns {Promise<string>}
 * @throws {DatabaseError}
 */
async function existByEmail(email) {
    try {
        const result = await pool.query(
            `SELECT 1 FROM webshop.users WHERE email = $1 LIMIT 1`,
            [email]
        )
        return result.rows.length > 0
    } catch (error) {
        throw new DatabaseError(
            `Failed proofing if user with email ${email} exist.`
        )
    }
}
```

## Mit roleback option
Wenn mehrere querys nötig sind, um ein Objekt zu erstellen, sollte die Option genutzt werden, um bei einem Fehler wieder alles rückgängig zu machen, um zu verhindern das nur das halbe Objekt abgespeichert wird.

```javascript
/**
 * Creates a User in the Database
 * @param {string} username
 * @param {string} hashedPassword
 * @param {string} email
 * @returns {Promise<AuthUser>}
 * @throws {DatabaseError}
 */
async function createUser(username, hashedPassword, email) {
    const client = await pool.connect()
    try {
        //start query client, to be abel to rollback if needed
        await client.query("BEGIN")

        //save user information in db
        const result = await client.query(
            `INSERT INTO webshop.users (name, password, email) VALUES ($1, $2, $3) RETURNING id`,
            [username, hashedPassword, email]
        )
        const userId = result.rows[0].id

        //add default role to user
        await client.query(
            `INSERT INTO webshop.user_has_role (userid, roleid) VALUES ($1, $2)`,
            [userId, DEFAULT_ROLE_ID]
        )

        //executing all querys
        await client.query("COMMIT")
        return new AuthUser(userId, username, email, ["user"])
    } catch (error) {
        //When error is thrown, rollback
        await client.query("ROLLBACK")
        throw new DatabaseError(
            `Failed storing user data in the DB: ${error.message}`,
            { cause: error }
        )
    } finally {
        client.release()
    }
}
```
