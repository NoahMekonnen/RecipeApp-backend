const mongoose = require("mongoose");
const User = require("./models/User");
const GroceryList = require("./models/GroceryList");
const Product = require("./models/Product");
const Meal = require("./models/Meal");
const Ingredient = require("./models/Ingredient");

async function commonBeforeAll() {
    await mongoose.connect('mongodb+srv://noahmekonnen0:Godalone1.@cluster0.elqsx.mongodb.net/recipe-app-database');  
}

async function commonAfterAll() {
    await mongoose.disconnect();
}

async function commonAfterEach() { 
    await User.deleteMany({});
    await Product.deleteMany({});
    await GroceryList.deleteMany({});
    await Meal.deleteMany({});
    await Ingredient.deleteMany({});
    await User.collection.dropIndexes()
}

const testUser1 = {
    username: "testuser1",
    password: "password",
    email:"testuser1@gmail.com"
}

const testUser2 = {
    username: "testuser2",
    password: "password",
    email: "testuser2@gmail.com"
}

const testProduct1 = {
    title: "Product1",
    image: "https://img.spoonacular.com/recipes/715538-312x231.jpg"
}

const testProduct2 = {
    title: "Product2",
    image: "https://img.spoonacular.com/ingredients_100x100/red-delicious-apples.png"
}

const testMeal1 = {
    title: "Meal1",
    image: "https://img.spoonacular.com/recipes/715538-312x231.jpg"
}

const testIngredient1 = {
    name: "Ingredient1",
    amountInUnitShort: "2 tsp",
    image: "https://img.spoonacular.com/recipes/715538-312x231.jpg"
}

module.exports = { commonAfterAll,
    commonAfterEach, 
    commonBeforeAll,
    testUser1,
    testUser2,
    testProduct1,
    testProduct2,
    testMeal1,
    testIngredient1
 };

