export default class Product {
    /**
     *
     * @param {int} id
     * @param {string} name
     * @param {string} description
     * @param {int} amount
     * @param {int} price
     */
    constructor(id, name, description, amount, price) {
        this.id = id
        this.name = name
        this.description = description
        this.amount = amount
        this.price = price
    }

    /**
     * Returns the price formatted in euros with comma decimal separator.
     * Example: 1010 => "10,10€"
     * @returns {string}
     */
    getConvertedPrice() {
        const euros = this.price / 100
        return euros.toFixed(2).replace(".", ",") + " €"
    }

    /**
     * Returns the the given price formatted in euros with comma decimal separator.
     * Example: 1010 => "10,10€"
     * @param {int} price
     * @returns {string}
     */
    getConvertedPriceMultiplied(amount) {
        const euros = (this.price * amount) / 100
        return euros.toFixed(2).replace(".", ",") + " €"
    }
}
