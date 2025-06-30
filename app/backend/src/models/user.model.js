import DatabaseError from "../exceptions/DatabaseError.js"
import NotFoundError from "../exceptions/NotFoundError.js"
import BasicUser from "../objects/user/BasicUser.js"
import AuthModel from "../models/auth.model.js"
import { pool } from "./pool.js"

/**
 * Returns a BasicUser by userId, if no user with that id exist, an NotFoundError will be thrown
 * @param {string} userId
 * @returns {Promise<BasicUser>}
 * @throws {NotFoundError}
 * @throws {DatabaseError}
 */
async function findBasicUserById(userId) {
    try {
        const result = await pool.query(
            `
            SELECT 
                u.id, 
                u.name, 
                u.email, 
                u.createdat 
            FROM 
                webshop.users as u 
            WHERE u.id = $1;`,
            [userId]
        )
        if (result.rows.length <= 0) {
            throw new NotFoundError(`User with id ${userId} doesn't exist`)
        }
        const row = result.rows[0]
        const user = new BasicUser(row.id, row.name, row.email, row.createdat)
        return user
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error
        }
        throw new DatabaseError(
            `Failed fetching user with id ${id}: ${error}`,
            { originalError: error }
        )
    }
}

/**
 * Deletes an User in Database with the given id.
 * @param {int} userId
 * @throws {DatabaseError}
 */
async function deleteUserById(userId) {
    try {
        const resultRole =  await pool.query(
            `
            DELETE FROM
                webshop.user_has_role as ur
            WHERE
                ur.userid = $1
            RETURNING *;
            `,
            [userId]
        )
        if(resultRole.rows.length <= 0){
            console.log("nothing deleted")
        }

        const resultWishlist =  await pool.query(
            `
            DELETE FROM
                webshop.user_wishlist_relation as w
            WHERE
                w.userid = $1
            RETURNING *;
            `,
            [userId]
        )
        if(resultWishlist.rows.length <= 0){
            console.log("nothing deleted")
        }
         const resultCart =  await pool.query(
            `
            DELETE FROM
                webshop.cartItems as cI
            WHERE
                cI.userid = $1
            RETURNING *;
            `,
            [userId]
        )
        if(resultCart.rows.length <= 0){
            console.log("nothing deleted")
        }

        const result =  await pool.query(
            `
            DELETE FROM
                webshop.users as u
            WHERE
                u.id = $1
            RETURNING *;
            `,
            [userId]
        )
        if(result.rows.length<=0){
            throw new DatabaseError("Failed to delete user")
        }
        return
    } catch (error) {
        throw new DatabaseError(
            `Failed on deleteUser with userId ${userId}: ${error}`,
            error
        )
    }
}

/**
 * Banns a User by userId, if no user with that id exist, an NotFoundError will be thrown
 * If no roles for user(only when created in db) might be an error, but still ban user
 * @param {string} userId
 * @throws {NotFoundError}
 * @throws {DatabaseError}
 */
async function bannUserById(userId) {
       try {
        // Überprüfen, ob der Nutzer existiert
        const userCheck = await pool.query(
            `SELECT id FROM webshop.users WHERE id = $1`,
            [userId]
        );
        if (userCheck.rows.length <= 0) {
            throw new NotFoundError(`User with id ${userId} doesn't exist`);
        }

        // Nutzer bannen
        const result = await pool.query(
            ` 
            UPDATE webshop.users
            SET isbanned=true
            WHERE id = $1
            RETURNING *;`,
            [userId]
        );

        if (result.rows.length <= 0) {
            throw new DatabaseError(`Failed to ban user with id ${userId}`);
        }

        const user = AuthModel.findAuthUserById(userId)
        return user
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error;
        }
        throw new DatabaseError(
            `Failed banning user with id ${userId}: ${error}`,
            { originalError: error }
        );
    }
}

/**
 * UnBanns a User by userId, if no user with that id exist, an NotFoundError will be thrown
 * If no roles for user(only when created in db) might be an error, but still unbann user
 * @param {string} userId
 * @throws {NotFoundError}
 * @throws {DatabaseError}
 */
async function unBannUserById(userId) {
       try {
        // Überprüfen, ob der Nutzer existiert
        const userCheck = await pool.query(
            `SELECT id FROM webshop.users WHERE id = $1`,
            [userId]
        );
        if (userCheck.rows.length <= 0) {
            throw new NotFoundError(`User with id ${userId} doesn't exist`);
        }

        // Nutzer unbannen
        const result = await pool.query(
            ` 
            UPDATE webshop.users
            SET isbanned=false
            WHERE id = $1
            RETURNING *;`,
            [userId]
        );

        if (result.rows.length <= 0) {
            throw new DatabaseError(`Failed to unban user with id ${userId}`);
        }

        const user = AuthModel.findAuthUserById(userId)
        return user
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error;
        }
        throw new DatabaseError(
            `Failed unbanning user with id ${userId}: ${error}`,
            { originalError: error }
        );
    }
}

/**
 * gets an User by userId, if no user with that id exist, an NotFoundError will be thrown
 * @param {string} userId
 * @throws {NotFoundError}
 * @throws {DatabaseError}
 */
async function getUserById(userId) {
       try {
        const user = AuthModel.findAuthUserById(userId)
        return user
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error;
        }
        throw new DatabaseError(
            `Failed getting user with id ${userId}: ${error}`,
            { originalError: error }
        );
    }
}

/**
 * changes roles of a User by userId, if no user with that id exist, an NotFoundError will be thrown
 * @param {string} userId
 * @param {string} roles
 * @throws {NotFoundError}
 * @throws {DatabaseError}
 */
async function changeUserRole(userId, roles) {
       try {
        const result = ""
        // Überprüfen, ob der Nutzer existiert
        const userBeforeChange = await AuthModel.findAuthUserById(userId)
        if (userBeforeChange.rows.length <= 0) {
            throw new NotFoundError(`User with id ${userId} doesn't exist`);
        }
        switch (userBeforeChange.roles.rows) {
            case 2:     //also need to check what roles should be inserted!!!!
                result = "A"
                break;
            case 0:
                result = await pool.query(
                    ` 
                    INSERT INTO webshop.user_has_role(id, userid, roleid)
                    VALUES ($1, 1),
		                    ($1,2);
                    RETURNING *;`,
                    [userId]
                );
                break;
            case 1:
                if (userBeforeChange.roles.toString().includes("a")){
                    result = await pool.query(
                    ` 
                    INSERT INTO webshop.user_has_role(id, userid, roleid)
                    VALUES ($1, 1);
                    RETURNING *;`,
                    [userId]
                    );
                }
                else {
                    result = await pool.query(
                    ` 
                    INSERT INTO webshop.user_has_role(id, userid, roleid)
                    VALUES ($1, 2);
                    RETURNING *;`,
                    [userId]
                    );
                }
            default:
                break;
        }
        
            if(userBeforeChange.roles.rows == 0){
                
            }
        }

        // Nutzer unbannen
         await pool.query(
            ` 
            INSERT INTO webshop.user_has_role
            SET roles=$1
            WHERE id = $2
            RETURNING *;`,
            [roles, userId]
        );

        if (!result.rows || result.rows.length <= 0) {
            throw new DatabaseError(`Failed to change Roles of user with id ${userId}`);
        }

        return result

    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error;
        }
        throw new DatabaseError(
            `Failed changing roles of user with id ${userId}: ${error}`,
            { originalError: error }
        );
    }
}

export default {
    findBasicUserById,
    deleteUserById,
    bannUserById,
    unBannUserById,
    getUserById,
    changeUserRole,
}
