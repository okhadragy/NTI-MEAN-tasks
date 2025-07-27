const products = require('../data/products.js');

const getAllProducts = (req, res) => {
    res.status(200).json(products);
}

const getProductById = (req, res) => {
    const productId = req.params.id;
    const product = products.find(p => p.id == productId);
    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

const createProduct = (req, res) => {
    const newProduct = req.body;
    if (!newProduct.productName || !newProduct.price) {
        return res.status(400).json({ message: 'Product name and price are required' });
    }
    const id = products.length ? products[products.length - 1].id + 1 : 1;
    products.push({ id, ...newProduct });
    res.status(201).json({ id, ...newProduct });
};

const updateProduct = (req, res) => {
    const productId = +req.params.id;
    const index = products.findIndex(p => p.id == productId);
    if (index !== -1) {
        const updatedProduct = { id: productId, ...req.body };
        products[index] = updatedProduct;
        res.status(200).json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

const deleteProduct = (req, res) => {
    const productId = +req.params.id;
    const index = products.findIndex(p => p.id == productId);
    if (index !== -1) {
        products.splice(index, 1);
        res.status(200).json({ message: "Product deleted successfully" });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
