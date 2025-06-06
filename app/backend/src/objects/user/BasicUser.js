export default class BasicUser {
    /**
     * 
     * @param {int} id 
     * @param {string} name 
     * @param {string} email 
     * @param {string} password 
     */
    constructor(id, name, email, password) {
        this.id = id
        this.name = name
        this.email = email
        this.password = password
    }
}