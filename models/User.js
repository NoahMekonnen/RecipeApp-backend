const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    favoriteMeals: [{type: mongoose.Schema.Types.ObjectId, ref: "Meal"}],
    groceryLists: [{type: mongoose.Schema.Types.ObjectId, ref: "Meal"}]
});

const User = mongoose.model('User', userSchema);

module.exports = User