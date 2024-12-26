const { testUser1, commonBeforeAll, commonAfterEach, commonAfterAll, tokens, testUser2, testProduct1, testProduct2 } = require("../_testCommon");
const GroceryList = require("../models/GroceryList");
const Product = require("../models/Product");
const User = require("../models/User");
const app = require("../app");
const request = require("supertest");
const axios = require("axios");
const { UnauthorizedError } = require("../expressError");
const { default: mongoose } = require("mongoose");


beforeAll(async () => await commonBeforeAll());
afterEach(async () => await commonAfterEach());
afterAll(async () => await commonAfterAll());

jest.mock('axios');

/******************************************************POST /products */

describe("POST /products", () => {
    test("logged in", async () => {
        const user = await User.create(testUser1);
        const groceryList = await GroceryList.create({user: user._id});
        const resp = await request(app)
                .post("/products")
                .send({
                    ...testProduct1,
                    groceryListId: groceryList._id
                })
                .set("authorization", `Bearer ${tokens[0]}`);
            
        expect(resp.status).toEqual(200);
        expect(resp.body.product.title).toEqual('Product1');
    });

    test("not logged in", async () => {
        const user = await User.create(testUser1);
        const groceryList = await GroceryList.create({user: user._id});
        const resp = await request(app)
                .post("/products")
                .send({
                    ...testProduct1,
                    groceryListId: groceryList._id
                });
        
        expect(resp.status).toEqual(401);
    });

    test("missing product info", async () => {
        const user = await User.create(testUser1);
        const resp = await request(app)
                .post("/products")
                .send({image: 'title'})
                .set("authorization", `Bearer ${tokens[0]}`);
            
        expect(resp.status).toEqual(400);
    });
});

/******************************************************GET /products */
describe("GET /products", () => {
    test("logged in", async () => {
        const products = jest.fn((number) => [
            {title: "Product1", image: "fail.png"},
            {title: "Product2", image: "fail.png"},
            {title: "Product3", image: "fail.png"}
        ].slice(number)
        );
        
        const fetchProducts = async (token) => {
            if(!token) throw new UnauthorizedError();
        
            const resp1 = {body: products};
            axios.get.mockResolvedValueOnce(resp1);
        
            const resp = await axios.get('/products', { headers: { Authorization: `Bearer ${tokens[0]}`}});
        
            return resp;
        }
        
        const resp = await fetchProducts(tokens[0]);
        
        expect(resp.body).toEqual(products);
    });
});

/******************************************************PATCH /products/:id */

describe("PATCH /products/:id", () => {
    test("add to grocery List while logged in", async () => {
        const user = await User.create(testUser1);
        const product = await Product.create(testProduct1);
        const groceryList = await GroceryList.create({user: user._id});
        const resp = await request(app)
                            .patch(`/products/${product._id}`)
                            .send({groceryListId: groceryList._id})
                            .set("authorization", `Bearer ${tokens[0]}`);
        
        expect(resp.body.product.groceryList).toEqual(groceryList._id.toString());
    });

    test("add to grocery List while not logged in", async () => {
        const user = await User.create(testUser1);
        const product = await Product.create(testProduct1);
        const groceryList = await GroceryList.create({user: user._id});
        const resp = await request(app)
                            .patch(`/products/${product._id}`)
                            .send({groceryListId: groceryList._id});

        expect(resp.status).toEqual(401);
    });

    test("add to grocery List while being a different user", async () => {
        const user1 = await User.create(testUser1);
        await User.create(testUser2);
        const product = await Product.create(testProduct1);
        const groceryList = await GroceryList.create({user: user1._id});
        const resp = await request(app)
                            .patch(`/products/${product._id}`)
                            .send({groceryListId: groceryList._id})
                            .set("authorization", `Bearer ${tokens[1]}`);

        expect(resp.status).toEqual(401);
    });

    test("add to grocery List for product that doesnt exist", async () => {
        const user1 = await User.create(testUser1);
        const groceryList = await GroceryList.create({user: user1._id});
        const resp = await request(app)
                            .patch(`/products/${new mongoose.Types.ObjectId()}`)
                            .send({groceryListId: groceryList._id})
                            .set("authorization", `Bearer ${tokens[0]}`);
        
        expect(resp.status).toEqual(404);
    });
});
