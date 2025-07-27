const path = require('path');
const { readFile } = require('fs').promises;

async function calculateTotal() {
    const cartPath = path.join(__dirname, '../data/cart.json');
    const cartData = await readFile(cartPath, 'utf-8');
    const json = JSON.parse(cartData);
    const cart = json.cart || [];

    // Calculate total price
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return total;
}

module.exports = calculateTotal;
