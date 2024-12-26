const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    title: {type: String, required: true},
    image: {type: String, required: true},
    groceryList: {type: "ObjectId", ref: 'GroceryList'}
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;