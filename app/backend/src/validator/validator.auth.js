import BadRequestError from "../exceptions/BadRequestError.js"

const MIN_PASSWORD_LENGTH = 4

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
}

/**
 * Validate, that the email is a correct email, throws error when not
 * @param {string} email
 * @throws {BadRequestError}
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (typeof email !== "string" || !emailRegex.test(email)) {
        throw new BadRequestError(`Given Email isn't a correct Email.`)
    }
}

export default {
    isSecurePassword,
    isValidEmail,
}
