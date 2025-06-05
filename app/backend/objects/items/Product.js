export default class Product{
    /**
     * 
     * @param {int} id 
     * @param {string} name 
     * @param {string} description 
     * @param {int} amount 
     * @param {int} price 
     */
    constructor(
        id, 
        name, 
        description,
        amount,
        price
    ){
        this.id = id
        this.name = name
        this.description = description
        this.amount = amount
        this.price = price
    }
}