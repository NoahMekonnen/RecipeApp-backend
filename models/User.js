const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    favoriteMeals: [{ type: mongoose.Schema.Types.ObjectId, ref: "meals"}]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;