const { testUser1, commonBeforeAll, commonAfterEach, commonAfterAll, tokens, testUser2, testProduct1, testProduct2 } = require("../_testCommon");
const GroceryList = require("../models/GroceryList");
const Product = require("../models/Product");
const User = require("../models/User");
const app = require("../app");
const request = require("supertest");


beforeAll(async () => await commonBeforeAll());
afterEach(async () => await commonAfterEach());
afterAll(async () => await commonAfterAll());

process.env.NODE_ENV = "test"



/******************************************************POST /groceryLists */

describe("POST /groceryLists", () => {
    test("logged in and same user", async () => {
        const user = await User.create(testUser1);
        const resp = await request(app)
                            .post("/groceryLists")
                            .send({user: user._id})
                            .set("authorization", `Bearer ${tokens[0]}`);

        expect(resp.body.groceryList.user).toEqual(user._id.toString());
    });

    test("not logged in", async () => {
        const user = await User.create(testUser1);
        const resp = await request(app)
                            .post("/groceryLists")
                            .send({user: user._id});
        
        expect(resp.status).toEqual(401);
    });

    test("wrong user", async () => {
        await User.create(testUser1);
        const user2 = await User.create(testUser2);
        const resp = await request(app)
                            .post("/groceryLists")
                            .send({user: user2._id})
                            .set("authorization", `Bearer ${tokens[0]}`);

        expect(resp.status).toEqual(401);
    });

    test("missing info", async () => {
        const resp = await request(app)
                            .post("/groceryLists")
                            .set("authorization", `Bearer ${tokens[0]}`);

        expect(resp.status).toEqual(400); 
    });
});

/******************************************************GET /groceryLists */

describe("GET /groceryLists", () => {
    test("w/ logged in and same user", async () => {
        const user = await User.create(testUser1);
        await GroceryList.create({user: user._id});
        await GroceryList.create({user: user._id});
        const resp = await request(app)
                .get("/groceryLists")
                .query({userId: user._id.toString()})
                .set("authorization", `Bearer ${tokens[0]}`);
    
        expect(resp.body.groceryLists.length).toEqual(2);
        expect(resp.body.groceryLists[0].user).toEqual(user._id.toString());
    });

    test("not logged in", async () => {
        const user = await User.create(testUser1);
        await GroceryList.create({user: user._id});
        await GroceryList.create({user: user._id});
        const resp = await request(app)
                .get("/groceryLists")
                .query({userId: user._id.toString()});
    
        expect(resp.status).toEqual(401);
    });

    test("w/ invalid user", async () => {
        const user1 = await User.create(testUser1);
        const user2 = await User.create(testUser2);
        await GroceryList.create({user: user1._id});
        await GroceryList.create({user: user2._id});
        const resp = await request(app)
                .get("/groceryLists")
                .query({userId: user1._id.toString()})
                .set("authorization", `Bearer ${tokens[1]}`);
    
        expect(resp.status).toEqual(401);
    });

    test("w/ missing info", async () => {
        const user1 = await User.create(testUser1);
        await GroceryList.create({user: user1._id});
        const resp = await request(app)
                .get("/groceryLists")
                .set("authorization", `Bearer ${tokens[0]}`);
    
        expect(resp.status).toEqual(400);
    });

});

/******************************************************PATCH /groceryLists/:id */

describe("PATCH /groceryLists/:id", () => {
    test("add w/ valid user", async () => {
        const user = await User.create(testUser1);
        const groceryList = await GroceryList.create({user: user._id});
        const product1 = await Product.create({
            ...testProduct1,
            groceryList: groceryList._id
        });

        const resp = await request(app)
                            .patch(`/groceryLists/${groceryList._id}`)
                            .send({product: product1})
                            .set("authorization", `Bearer ${tokens[0]}`);
        
        
        expect(resp.body.groceryList.products.length).toEqual(1);

        const product = await Product.findOne({title: "Product1"});
        expect(resp.body.groceryList.products[0]).toEqual(product._id.toString());
    });

    test("not logged in", async () => {
        const user = await User.create(testUser1);
        const groceryList = await GroceryList.create({user: user._id});
        const resp = await request(app)
                            .patch(`/groceryLists/${groceryList._id}`)
                            .send({product: testProduct1});

        expect(resp.status).toEqual(401);
    });

    test("add w/ invalid user", async () => {
        const user1 = await User.create(testUser1);
        await User.create(testUser2);
        const groceryList = await GroceryList.create({user: user1._id});
        const resp = await request(app)
                            .patch(`/groceryLists/${groceryList._id}`)
                            .send({product: testProduct1})
                            .set("authorization", `Bearer ${tokens[1]}`);

        expect(resp.status).toEqual(401);
    });

    test("add w/ missing info", async () => {
        const user1 = await User.create(testUser1);
        const groceryList = await GroceryList.create({user: user1._id});
        const resp = await request(app)
                            .patch(`/groceryLists/${groceryList._id}`)
                            .set("authorization", `Bearer ${tokens[0]}`);

        expect(resp.status).toEqual(400);
    });
});

/******************************************************DELETE /groceryLists/:id */

describe("DELETE /groceryLists/:id", () => {
    test("logged in and same user", async () => {
        const user = await User.create(testUser1);
        const groceryList = await GroceryList.create({user: user._id});
        const resp = await request(app)
                            .delete(`/groceryLists/${groceryList._id}`)
                            .set("authorization", `Bearer ${tokens[0]}`);

        expect(resp.status).toEqual(200);
        expect(resp.body.deleted).toEqual(groceryList._id.toString());
    });

    test("not logged in", async () => {
        const user = await User.create(testUser1);
        const groceryList = await GroceryList.create({user: user._id});
        const resp = await request(app)
                            .delete(`/groceryLists/${groceryList._id}`);

        expect(resp.status).toEqual(401);
    });

    test("w/ invalid user", async () => {
        const user = await User.create(testUser1);
        await User.create(testUser2);
        const groceryList = await GroceryList.create({user: user._id});
        const resp = await request(app)
                            .delete(`/groceryLists/${groceryList._id}`)
                            .set("authorization", `Bearer ${tokens[1]}`);

        expect(resp.status).toEqual(401);
    });
});

/******************************************************DELETE /groceryLists/:id/products/:productId */

describe("Remove product from grocery list", () => {
    test("logged in and same user", async () => {
        const user = await User.create(testUser1);
        const groceryList = await GroceryList.create({user: user._id});
        const product1 = await Product.create({
            ...testProduct1,
            groceryList: groceryList._id
        });
        const product2 = await Product.create({
            ...testProduct2,
            groceryList: groceryList._id
        });
        groceryList.products = [product1, product2];

        await groceryList.save();
        
        const resp = await request(app)
                            .delete(`/groceryLists/${groceryList._id}/products/${product1._id}`)
                            .set("authorization", `Bearer ${tokens[0]}`);

        expect(resp.status).toEqual(200);
        expect(resp.body.deleted).toEqual(product1._id.toString());
    });

    test("not logged in", async () => {
        const user = await User.create(testUser1);
        const groceryList = await GroceryList.create({user: user._id});
        const product1 = await Product.create({
            ...testProduct1,
            groceryList: groceryList._id
        });
        const product2 = await Product.create({
            ...testProduct2,
            groceryList: groceryList._id
        });
        groceryList.products = [product1, product2];

        await groceryList.save();
        const resp = await request(app)
                            .delete(`/groceryLists/${groceryList._id}/products/${product1._id}`);

        expect(resp.status).toEqual(401);
    });

    test("w/ invalid user", async () => {
        const user = await User.create(testUser1);
        await User.create(testUser2);
        const groceryList = await GroceryList.create({user: user._id});
        const product1 = await Product.create({
            ...testProduct1,
            groceryList: groceryList._id
        });
        const product2 = await Product.create({
            ...testProduct2,
            groceryList: groceryList._id
        });
        
        groceryList.products = [product1, product2];

        await groceryList.save();

        const resp = await request(app)
                            .delete(`/groceryLists/${groceryList._id}/products/${product1._id}`)
                            .set("authorization", `Bearer ${tokens[1]}`);

        expect(resp.status).toEqual(401);
    });
});