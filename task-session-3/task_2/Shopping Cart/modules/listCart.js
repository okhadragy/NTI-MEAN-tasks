const path = require('path');
const { readFile } = require('fs').promises;

async function listCart() {
    const cartPath = path.join(__dirname, '../data/cart.json');
    const cartData = await readFile(cartPath, 'utf-8');
    if (!cartData) {
        return [];
    }
    const json = JSON.parse(cartData);
    return json.cart || [];
}

module.exports = listCart;
