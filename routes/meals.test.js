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

jest.mock('axios');

/******************************************************POST /meals */

describe("POST /meals", () => {
    test("logged in", async () => {
        const resp = await request(app)
                        .post("/meals")
                        .send(testMeal1)
                        .set("authorization", `Bearer ${tokens[0]}`);

        expect(resp.status).toEqual(201);
        expect(resp.body.meal.title).toEqual(testMeal1.title);
    });

    test("not logged in", async () => {
        const resp = await request(app)
                        .post("/meals")
                        .send(testMeal1)
                        .set("authorization", `Bearer ${tokens[0]}`);

        expect(resp.status).toEqual(201);
        expect(resp.body.meal.title).toEqual(testMeal1.title);
    });

    test("w/ missing info", async () => {
        const resp = await request(app)
                        .post("/meals")
                        .send({title: "fail"})
                        .set("authorization", `Bearer ${tokens[0]}`);

        expect(resp.status).toEqual(400);
    });
});

/******************************************************GET /meals */

axios.get.mockResolvedValue({data: {
    results: [testMeal1, testMeal2]
}
});

describe("GET /meals", () => {
    test("logged in", async () => {
        
        const resp = await request(app)
                            .get("/meals")
                            .query({number: 1})
                            .set("authorization", `Bearer ${tokens[0]}`);


        expect(resp.status).toEqual(200);
        expect(resp.body.meals.length).toEqual(2);
        expect(resp.body.meals[0].title).toEqual("Meal1");
        expect(axios.get).toHaveBeenCalledWith(`${process.env.SPOONACULAR_BASE_URL}/recipes/complexSearch?apiKey=${process.env.SPOONACULAR_API_KEY}&number=1`);
    });

    test("not logged in", async () => {
        const resp = await request(app)
                            .get("/meals")
                            .query({number: 1});

        
        expect(resp.status).toEqual(200);
        expect(resp.body.meals.length).toEqual(2);
        expect(resp.body.meals[0].title).toEqual("Meal1");
        expect(axios.get).toHaveBeenCalledWith(`${process.env.SPOONACULAR_BASE_URL}/recipes/complexSearch?apiKey=${process.env.SPOONACULAR_API_KEY}&number=1`);
    });

    test("missing info", async () => {
        const resp = await request(app)
                            .get("/meals");

        
        expect(resp.status).toEqual(400);
    });
});

/******************************************************GET /meals/:id */

describe("GET /meals/:id", () => {
    test("logged in", async () => {
        axios.get.mockResolvedValue({data: {
            ...testMeal1, extendedIngredients: [1, 2, 3]
        }});
        const meal = await Meal.create({
            title: testMeal1.title,
            image: testMeal1.image,
            spoonacularId: 1
        });
      
        const resp = await request(app)
                            .get(`/meals/${meal._id}`)
                            .set("authorization", `Bearer ${tokens[0]}`);
        
        expect(resp.status).toEqual(200);
        expect(resp.body.meal.title).toEqual("Meal1");
        expect(resp.body.meal.ingredients).toEqual(["1", "2", "3"]);
    });

    test("not logged in", async () => {
        axios.get.mockResolvedValue({data: {
            ...testMeal1, extendedIngredients: [1, 2, 3]
        }});

        const meal = await Meal.create({
            title: testMeal1.title,
            image: testMeal1.image,
            spoonacularId: 1
        });

        const resp = await request(app)
                            .get(`/meals/${meal._id}`);

        expect(resp.status).toEqual(200);
        expect(resp.body.meal.title).toEqual("Meal1");
        expect(resp.body.meal.ingredients).toEqual(["1", "2", "3"]);
    });

    test("not found", async () => {
        axios.get.mockResolvedValue({data: {
            ...testMeal1, extendedIngredients: [1, 2, 3]
        }});
        
        const resp = await request(app)
                            .get(`/meals/${new mongoose.Types.ObjectId()}`);
        
        expect(resp.status).toEqual(404);
    })
});

