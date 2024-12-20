const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    favoriteMeals: [{type: mongoose.Types.ObjectId, ref: "Meal"}]
});

const User = mongoose.model('User', userSchema);