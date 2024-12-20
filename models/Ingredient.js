const mongoose = require("mongoose");

const IngredientSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true},
    amountInUnitShort: { type: String, required: true },
    image: String,
    meal: { type: 'ObjectId', ref: 'Meal'},
})

const Ingredient = mongoose.model('Ingredient', IngredientSchema);

module.exports = Ingredient;