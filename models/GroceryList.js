const mongoose = require("mongoose");

const GroceryListSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    user: {type: "ObjectId", ref: "User", required: true},
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product'}]
});

const GroceryList = mongoose.model("Grocery List", GroceryListSchema);

module.exports = GroceryList;