const { testUser1, commonBeforeAll, commonAfterEach, commonAfterAll, tokens, testMeal1, testMeal2, testUser2 } = require("../_testCommon");
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


/******************************************************GET /users */

describe("GET /users", () => {
    test("logged in", async () => {
        await User.create(testUser1);
        await User.create(testUser2);
        const resp = await request(app)
                            .get("/users")
                            .set("authorization", `Bearer ${tokens[0]}`);
        
        expect(resp.status).toEqual(200);
        expect(resp.body.users.length).toEqual(2);
        expect(resp.body.users[0].username).toEqual("testuser1");
    });

    test("not logged in", async () => {
        await User.create(testUser1);
        await User.create(testUser2);
        const resp = await request(app)
                            .get("/users");
        
        expect(resp.status).toEqual(200);
        expect(resp.body.users.length).toEqual(2);
        expect(resp.body.users[0].username).toEqual("testuser1");
    });

});


/******************************************************GET /users/:id */

describe("GET /users/:id", () => {
    test("logged in", async () => {
        const user = await User.create(testUser1);
        const resp = await request(app)
                            .get(`/users/${user._id}`)
                            .set("authorization", `Bearer ${tokens[0]}`);

        expect(resp.status).toEqual(200)
        expect(resp.body.user.username).toEqual("testuser1");
    });

    test("not logged in", async () => {
        const user = await User.create(testUser1);
        const resp = await request(app)
                            .get(`/users/${user._id}`);

        expect(resp.status).toEqual(200)
        expect(resp.body.user.username).toEqual("testuser1");
    });

    test("not found", async () => {
        const user = await User.create(testUser1);
        const resp = await request(app)
                            .get(`/users/${new mongoose.Types.ObjectId()}`);

        expect(resp.status).toEqual(404);
});

});

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

