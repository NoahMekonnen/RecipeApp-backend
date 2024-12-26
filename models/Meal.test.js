const mongoose = require("mongoose");
const Meal = require("./Meal");
const { commonBeforeAll, commonAfterEach, commonAfterAll, testMeal1 } = require("../_testCommon");


beforeAll(async () => commonBeforeAll());
afterEach(async () => commonAfterEach());
afterAll(async () => commonAfterAll());



/******************************************************CREATE */

describe("Create a meal", () => {
    test("w/ info", async () => {
        const meal1 = await Meal.create({
            title: testMeal1.title,
            image: testMeal1.image,
            spoonacularId: 1
        });

        expect(meal1.title).toEqual("Meal1");
        expect(meal1.ingredients.length).toEqual(0);
    });

    test("w/ missing info", async () => {
        try{
            await Meal.create({title:"fail"})
        } catch(err){
            expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        }
    });
});

/******************************************************DELETE */

describe("Delete a meal", () => {
    test("simple", async () => {
        await Meal.create({
            title: testMeal1.title,
            image: testMeal1.image,
            spoonacularId: 1
        });
        await Meal.deleteOne({title: "Meal1"});
        const allMeals = await Meal.find();

        expect(allMeals.length).toEqual(0);
    });
});