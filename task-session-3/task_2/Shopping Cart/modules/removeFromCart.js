const path = require('path');
const { writeFile, readFile } = require('fs').promises;

async function removeFromCart(productId) {
    const cartPath = path.join(__dirname, '../data/cart.json');
    const cartData = await readFile(cartPath, 'utf-8');
    const json = JSON.parse(cartData);
    const cart = json.cart || [];
    const updatedCart = cart.filter(item => item.id !== productId);
    await writeFile(cartPath, JSON.stringify({ cart: updatedCart }, null, 2));
}

module.exports = removeFromCart;
