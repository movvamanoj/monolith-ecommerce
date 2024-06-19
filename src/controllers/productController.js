const getAllProducts = (req, res) => {
    res.send('Get all products');
};

const createProduct = (req, res) => {
    res.send('Create a new product');
};

module.exports = {
    getAllProducts,
    createProduct,
};
