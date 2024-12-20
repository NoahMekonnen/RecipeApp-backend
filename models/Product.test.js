const mongoose = require("mongoose");

const Product = require("./Product");
const GroceryList = require("./GroceryList");
const User = require("./User.js");


const { testUser1,
    testProduct1,
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

describe("Make a product", () => {
    test("w/ valid info", async () => {
        const user1 = await User.create(testUser1);
        const groceryList1 = await GroceryList.create({ user: user1._id });
        const product1 = await Product.create({
            ...testProduct1,
            groceryList: groceryList1._id
        });

        expect(product1.title).toEqual("Product1");
    });

    test("w/ missing info", async () => {
        const user1 = await User.create(testUser1);
        const groceryList1 = await GroceryList.create({ user: user1._id });
        try {
            await Product.create({
                ...testProduct1
            });
        } catch (err) {
            expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        }
    });

    test("w/ invalid info", async () => {
        const user1 = await User.create(testUser1);
        const groceryList1 = await GroceryList.create({ user: user1._id });
        try{
            await Product.create({
                ...testProduct1,
                title: 4,
                groceryList: groceryList1._id
            });
        } catch(err) {
            expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        }
    })
});


/******************************************************DELETE */

describe("Delete a product", () => {
    test("simple delete", async () => {
        const user1 = await User.create(testUser1);
        const groceryList1 = await GroceryList.create({user: user1._id });
        const product1 = await Product.create({
            ...testProduct1,
            groceryList: groceryList1._id
        });

        expect(product1.title).toEqual("Product1");

        await Product.deleteOne({title: "Product1"});
        const allProducts = await Product.find();

        expect(allProducts.length).toEqual(0);
    })
});