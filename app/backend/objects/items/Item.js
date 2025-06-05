class Item{
    /**
     * 
     * @param {int} id 
     * @param {Product} product 
     * @param {int} amount 
     * @param {Date} addedAt 
     */
    constructor(
        id,
        product,
        amount,
        addedAt,
    ){
        if(new.target === Item){
            throw new Error("Cannot instantiate abstract class")
        }
        this.id = id
        this.product = product
        this.amount = amount
        this.addedAt = addedAt
    }
}