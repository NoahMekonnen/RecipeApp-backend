const mongoose = require("mongoose");

const groceryListSchema = mongoose.Schema({
    date: {type: Date, default: Date.now()},
    user: {type: "ObjectId", ref: "User", required: true},
    products: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}]
});

const GroceryList = mongoose.model('GroceryList', groceryListSchema);

module.exports = GroceryList;