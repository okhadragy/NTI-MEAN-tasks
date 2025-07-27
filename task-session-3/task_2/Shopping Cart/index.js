const addToCart = require('./modules/addToCart');
const listCart = require('./modules/listCart');
const calculateTotal = require('./modules/calculateTotal');
const removeFromCart = require('./modules/removeFromCart');

async function main() {
    await addToCart("1");
    const cart = await listCart();
    console.log("Cart items:", cart);
    const total = await calculateTotal();
    console.log("Total price:", total);
    await removeFromCart("2");
}

main().catch(console.error);
