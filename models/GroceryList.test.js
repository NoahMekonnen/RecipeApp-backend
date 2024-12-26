const GroceryList = require("./GroceryList");
const User = require("./User");
const Product = require("./Product.js");


const {testUser1, commonAfterAll, commonBeforeAll, commonAfterEach, testProduct1, testProduct2} = require("../_testCommon.js");
const mongoose = require("mongoose");


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

describe("Create Grocery List", function() {
    test("w/ user", async () => {
        const user1 = await User.create(testUser1);
        const groceryList1 = await GroceryList.create({
            user: user1._id
        });

        expect(groceryList1.user).toEqual(user1._id);
    })

    test("w/ no user", async () => {
        try {
            const test = await GroceryList.create({});
        } catch(err) {
            expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        }
    });

    test("w/ invalid info", async () => {
        const user1 = await User.create(testUser1);
        try{
            const test = await GroceryList.create({user: "Fail"});
        } catch(err) {
            expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        }
    });
});

/******************************************************READ */

describe("Get all products in a grocery list", () => {
    test("simple", async () => {
        const user1 = await User.create(testUser1);
        const groceryList1 = await GroceryList.create({user: user1._id});
        const product1 = await Product.create({
            ...testProduct1,
            groceryList: groceryList1._id
        });
        const product2 = await Product.create({
            ...testProduct2,
            groceryList: groceryList1._id
        });

        groceryList1.products = [product1._id, product2._id];
        await groceryList1.save();

        const updatedGroceryList = await GroceryList.findById(groceryList1._id).populate('products');
        
        expect(updatedGroceryList.products.length).toEqual(2);
        expect(updatedGroceryList.products[0].title).toEqual("Product1");
    });
});


/******************************************************UPDATE */

describe("Updating Grocery List", () => {
    test("adding products to list", async () => {
        const user1 = await User.create(testUser1);
        const groceryList1 = await GroceryList.create({user: user1._id});
        const product1 = new Product(testProduct1);
        const product2 = new Product(testProduct2);
        groceryList1.products = [product1, product2];

        await groceryList1.save();

        expect(groceryList1.products.length).toEqual(2);
    });
});

/******************************************************DELETE */

describe("Delete Grocery List", function() {
    test("simple delete", async () => {
        const user1 = await User.create(testUser1);
        const groceryList1 = await GroceryList.create({
            user: user1._id
        });

        expect(groceryList1.user).toEqual(user1._id);

        await GroceryList.deleteOne({user: user1.id});
        const groceryLists = await GroceryList.find();

        expect(groceryLists.length).toEqual(0);
    });
});