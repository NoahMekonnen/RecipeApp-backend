const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    image: { type: String, unique: true, required: true},
    title: { type: String, unique: true, required: true},
    groceryList: { type: 'ObjectId', ref: 'GroceryList', required: true}
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;