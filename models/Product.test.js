const { testProduct1, commonBeforeAll, commonAfterEach, commonAfterAll, testUser1, testProduct2 } = require("../_testCommon");
const Product = require("./Product");
const mongoose = require("mongoose");
const GroceryList = require("./GroceryList");
const User = require("./User");



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

describe("Create a product", () => {
    test("w/ valid info", async () => {
        const user1 = await User.create(testUser1);
        const groceryList1 = await GroceryList.create({user: user1._id});
        const product1 = await Product.create({
            ...testProduct1,
            groceryList: groceryList1._id
        });

        expect(product1.title).toEqual("Product1");
    });

    test("w/ missing info", async () => {
        try{
            const product1 = await Product.create({
                image: "fail"
            });
        } catch(err) {
            expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        }
    });

    test("w/ invalid info", async () => {
        const user1 = await User.create(testUser1);
        const groceryList1 = await GroceryList.create({user: user1._id});
        try{
            const product1 = await Product.create({
                ...testProduct1,
                groceryList: "fail"
            });
        } catch(err) {
            expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        }
    });
});

/******************************************************READ */

describe("Get all products", () => {
    test("simple", async () => {
        const user1 = await User.create(testUser1);
        const groceryList1 = await GroceryList.create({user:user1._id});
        await Product.create({
            ...testProduct1,
            groceryList: groceryList1._id
        });
        await Product.create({
            ...testProduct2,
            groceryList: groceryList1._id
        });
        const allProducts = await Product.find();

        expect(allProducts.length).toEqual(2);
    });

    test("filter", async () => {
        const user1 = await User.create(testUser1)
        const groceryList1 = await GroceryList.create({user:user1._id});
        const product1 = await Product.create({
            ...testProduct1,
            groceryList: groceryList1._id
        });
        const product2 = await Product.create({
            ...testProduct2,
            groceryList: groceryList1._id
        });
        const filteredProducts = await Product.find({title: /1/i});

        expect(filteredProducts.length).toEqual(1);
    });
});

/******************************************************DELETE */

describe("Delete a product", () => {
    test("simple", async () => {
        const user1 = await User.create(testUser1);
        const groceryList1 = await GroceryList.create({user: user1._id});
        await Product.create({
            ...testProduct1,
            groceryList: groceryList1._id
        });
        await Product.deleteOne({title: "Product1"});
        const allProducts = await Product.find();

        expect(allProducts.length).toEqual(0);
    })
})