const mongoose = require("mongoose");

const mealSchema = mongoose.Schema({
    title: {type: String, required: true, unique: true},
    image: {type: String, required:true, unique: true},
    spoonacularId: {type: Number, required: true, unique: true},
    ingredients: [{type: String}]
});

const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;