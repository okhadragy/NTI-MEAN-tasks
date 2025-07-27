const { log } = require('console');
const path = require('path');
const { writeFile, readFile } = require('fs').promises;

async function addToCart(productId) {
    const cartPath = path.join(__dirname, '../data/cart.json');
    const cartData = await readFile(cartPath, 'utf-8');
    const json = JSON.parse(cartData);
    const cart = json.cart || [];

    if (!productId) {
        console.error("Invalid product ID");
        return;
    }
    let item = {};
    item.id = productId;
    if (cart.some(item => item.id === productId)) {
        item.quantity = cart.find(item => item.id === productId).quantity + 1;
        cart[cart.findIndex(item => item.id === productId)].quantity = item.quantity;
    } else {
        item.quantity = 1;
        const productPath = path.join(__dirname, '../data/products.json');
        const productData = await readFile(productPath, 'utf-8');
        const productsJson = JSON.parse(productData);
        const product = productsJson.products.find(p => p.id === productId);
        if (!product) {
            console.error("Product not found");
            return;
        }
        item.price = product.price;
        item.name = product.name;
        cart.push(item);
    }
    await writeFile(cartPath, JSON.stringify({ cart: cart }, null, 2));
}

module.exports = addToCart;
