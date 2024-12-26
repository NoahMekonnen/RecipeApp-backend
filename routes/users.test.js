const { testUser1, commonBeforeAll, commonAfterEach, commonAfterAll, tokens, testMeal1, testMeal2 } = require("../_testCommon");
const GroceryList = require("../models/GroceryList");
const Product = require("../models/Product");
const User = require("../models/User");
const app = require("../app");
const request = require("supertest");
const axios = require("axios");
const { UnauthorizedError } = require("../expressError");
const { default: mongoose } = require("mongoose");
const Meal = require("../models/Meal");


beforeAll(async () => await commonBeforeAll());
afterEach(async () => await commonAfterEach());
afterAll(async () => await commonAfterAll());


/******************************************************PATCH /users/:id/meals/:mealId */

describe("PATCH /users/:id/meals/:mealId", () => {
    test("logged in and favorite", async () => {
        const user = await User.create(testUser1);
        const meal = await Meal.create({
            title: testMeal1.title,
            image: testMeal1.image,
            spoonacularId: 1
        });
        const resp = await request(app)
                            .patch(`/users/${user._id}/meals/${meal._id}`)
                            .set("authorization", `Bearer ${tokens[0]}`);
        
        expect(resp.status).toEqual(200);
        expect(resp.body.user.favoriteMeals.length).toEqual(1);
        expect(resp.body.user.favoriteMeals[0].title).toEqual("Meal1");
    });

    test("logged in and unfavorite", async () => {
        const user = await User.create(testUser1);
        const meal = await Meal.create({
            title: testMeal1.title,
            image: testMeal1.image,
            spoonacularId: 1
        });
        user.favoriteMeals.push(meal._id);
        await user.save();

        const resp = await request(app)
                            .patch(`/users/${user._id}/meals/${meal._id}`)
                            .set("authorization", `Bearer ${tokens[0]}`);
        
        expect(resp.status).toEqual(200);
        expect(resp.body.user.favoriteMeals.length).toEqual(0);
    });

    test("not logged in", async () => {
        const user = await User.create(testUser1);
        const meal = await Meal.create({
            title: testMeal1.title,
            image: testMeal1.image,
            spoonacularId: 1
        });
        user.favoriteMeals.push(meal._id);

        await user.save();

        const resp = await request(app)
                            .patch(`/users/${user._id}/meals/${meal._id}`);
        
        expect(resp.status).toEqual(401);
    });

    test("wrong user", async () => {
        const user = await User.create(testUser1);
        const meal = await Meal.create({
            title: testMeal1.title,
            image: testMeal1.image,
            spoonacularId: 1
        });
        user.favoriteMeals.push(meal._id);

        await user.save();

        const resp = await request(app)
                            .patch(`/users/${user._id}/meals/${meal._id}`)
                            .set("authorization", `Bearer ${tokens[1]}`);
        
        expect(resp.status).toEqual(401);
    });


    test("some id not found", async () => {
        const meal = await Meal.create({
            title: testMeal1.title,
            image: testMeal1.image,
            spoonacularId: 1
        });
        const resp = await request(app)
                            .patch(`/users/${new mongoose.Types.ObjectId()}/meals/${meal._id}`)
                            .set("authorization", `Bearer ${tokens[0]}`);
        
        expect(resp.status).toEqual(404);
    });

});

