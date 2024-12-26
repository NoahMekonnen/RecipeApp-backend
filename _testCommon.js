const { default: mongoose } = require("mongoose");
const GroceryList = require("./models/GroceryList");
const Meal = require("./models/Meal");
const Product = require("./models/Product");
const User = require("./models/User")
const jwt = require("jsonwebtoken");
const { getDatabaseUri } = require("./config");

// test database

async function commonAfterAll() {
    mongoose.disconnect();
}

async function commonBeforeAll() {
    process.env.NODE_ENV= "test";
    mongoose.connect(getDatabaseUri());
}

async function commonAfterEach(){
    await User.deleteMany({});
    await Product.deleteMany({});
    await GroceryList.deleteMany({});
    await Meal.deleteMany({});
}


const testUser1 = {
    username: "testuser1",
    password: "password",
    email: "testuser1@gmail.com"
}

const testUser2 = {
    username: "testuser2",
    password: "password",
    email:"testuser2@gmail.com"
}

const testProduct1 = {
    title: "Product1",
    image: "https://img.spoonacular.com/ingredients_100x100/red-delicious-apples.png"
}

const testProduct2 = {
    title: "Product2",
    image: "https://img.spoonacular.com/recipes/715538-312x231.jpg"
}

const testMeal1 = {
    title: "Meal1",
    image: "https://img.spoonacular.com/recipes/715538-312x231.jpg",
    id: 1
}

const testMeal2 = {
    title: "Meal2",
    image: "https://img.spoonacular.com/ingredients_100x100/red-delicious-apples.png",
    id:2
}

const token1 = jwt.sign(testUser1,"secret");
const token2 = jwt.sign(testUser2, "secret");
const tokens = [token1, token2];

module.exports = {
    commonAfterAll,
    commonAfterEach,
    commonBeforeAll,
    testUser1,
    testUser2,
    testProduct1,
    testProduct2,
    testMeal1,
    testMeal2,
    tokens
}


