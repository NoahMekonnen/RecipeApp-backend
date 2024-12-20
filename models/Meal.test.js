const mongoose = require("mongoose");
const Meal = require("./Meal.js");


const { testUser1,
    testProduct1,
    testMeal1,
    commonAfterAll,
    commonBeforeAll,
    commonAfterEach }
    = require("../_testCommon.js");


beforeAll(async () => {
    await commonBeforeAll();
});

afterAll(async () => {
    await commonAfterAll();
});

beforeEach(async () => {
    await commonAfterEach();
});


/******************************************************CREATE */

describe("Create a meal", () => {
    test("w/ valid info", async () => {
        const meal1 = await Meal.create({...testMeal1});

        expect(meal1.title).toEqual("Meal1");
        expect(meal1.ingredients.length).toEqual(0);
    });

    test("w/ missing info", async () => {
        try{
            await Meal.create({title: "test product"});
        } catch(err) {
            expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        }    
    });

});

/******************************************************DELETE */

describe("Delete a meal", () => {
    test("simple delete", async () => {
        const meal1 = await Meal.create(testMeal1);

        expect(meal1.title).toEqual("Meal1");

        await Meal.deleteOne({title: "Meal1"});
        const allMeals = await Meal.find();

        expect(allMeals.length).toEqual(0);
    });
});

