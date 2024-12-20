const GroceryList = require("./GroceryList");
const Product = require("./Product");
const User = require("./User");


const {testUser1, commonAfterAll, commonBeforeAll, commonAfterEach, testIngredient1, testMeal1} = require("../_testCommon.js");
const { default: mongoose } = require("mongoose");
const Ingredient = require("./Ingredient.js");
const Meal = require("./Meal.js");

beforeAll(async () => {
    await commonBeforeAll();
});

afterEach(async () => {
    await commonAfterEach();
});

afterAll(async () => {
    await commonAfterAll();
});


/******************************************************CREATE */

describe("Create an ingredient", () => {
    test("w/ valid info", async () => {
        const meal1 = await Meal.create(testMeal1);
        const ingredient1 = await Ingredient.create({
            ...testIngredient1,
            meal: meal1._id
        });

        expect(ingredient1.name).toEqual("Ingredient1");
    });

    test("w/ missing info", async () => {
        const meal1 = await Meal.create(testMeal1);
        try{
            await Ingredient.create({
                ...testIngredient1,
                meal: meal1._id
            });
        } catch(err) {
            expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        }
    });

    test("w/ invalid info", async () => {
        const meal1 = await Meal.create(testMeal1);
        try{
            const test = await Ingredient.create({
                meal: meal1._id,
                name: true, 
                amountInUnitShort: "2 tsp"
            });
            console.log(test)
        } catch(err) {
            console.log("hi")
            expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        }
    });
});