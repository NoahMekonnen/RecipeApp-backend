const { default: mongoose } = require("mongoose");
const { testUser1, commonBeforeAll, commonAfterEach, commonAfterAll, testUser2 } = require("../_testCommon");
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

describe("Create a user", () => {
    test("w/ valid creds", async () => {
        const user1 = await User.create(testUser1);

        expect(user1.username).toEqual("testuser1");
        expect(user1.favoriteMeals.length).toEqual(0);
    });

    test("w/ missing creds", async () => {
        try{
            const user1 = await User.create({
                name:"fail",
                password:"fail"
            })
        } catch(err) {
            expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        }
    })
});

/******************************************************READ */

describe("Get a user", () => {
    test("simple", async () => {
        const user1 = await User.create(testUser1);
        const user2 = await User.create(testUser2);
        const user = await User.findById(user1._id);

        expect(user2.username).toEqual("testuser2");
    });
});
