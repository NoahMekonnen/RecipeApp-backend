const mongoose = require("mongoose");

const MealSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    image: { type: String, required: true, unique: true },
    ingredients: [{type: mongoose.Schema.Types.ObjectId, ref: "Ingredient"}]
})

const Meal = mongoose.model('Meal', MealSchema);

module.exports = Meal;