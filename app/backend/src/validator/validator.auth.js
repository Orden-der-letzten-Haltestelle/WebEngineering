import BadRequestError from "../exceptions/BadRequestError.js"
import authModel from "../models/auth.model.js"

const MIN_PASSWORD_LENGTH = 4

/**
 * Validate, that the password fit the requirements, throws error when not
 * @param {string} password
 */
function isSecurePassword(password) {
    if (password.length < MIN_PASSWORD_LENGTH) {
        throw new BadRequestError(
            `Given Password doesn't fit requirments, password needs at least ${MIN_PASSWORD_LENGTH} Characters.`
        )
    }
    return true
}

/**
 * Validate, that the email is a correct email, throws error when not
 * @param {string} email
 * @returns {Promise}
 * @throws {BadRequestError}
 */
async function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (typeof email !== "string" || !emailRegex.test(email)) {
        throw new BadRequestError(`Given Email isn't a correct Email.`)
    }

    //proof that email doesn't already exist
    const exists = await authModel.existByEmail(email)
    if (exists) {
        throw new BadRequestError(`User with given Email already exist.`)
    }

    return true
}

export default {
    isSecurePassword,
    isValidEmail,
}
