const GroceryList = require("./GroceryList");
const User = require("./User");


const {testUser1, commonAfterAll, commonBeforeAll, commonAfterEach} = require("../_testCommon.js");
const { default: mongoose } = require("mongoose");

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