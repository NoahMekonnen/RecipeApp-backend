const User = require("./User")
const mongoose = require("mongoose")


beforeAll(async () => {
    await mongoose.connect('mongodb+srv://noahmekonnen0:Godalone1.@cluster0.elqsx.mongodb.net/recipe-app-database'); 
})

afterAll(async () => {
    await mongoose.disconnect();
})

beforeEach(async () => {
    await User.deleteMany({});
    await User.collection.dropIndexes()
})

const user = {
    username: "testuser1",
    password: "password",
    email:"testuser1@gmail.com"
}


/******************************************************CREATE */

describe("Create a User", function() {
    test("w/ all valid info", async function() {
        const user1 =  await User.create(user);
    
        expect(user1.username).toEqual("testuser1");
        expect(user1.password).toEqual("password");
        expect(user1.email).toEqual("testuser1@gmail.com");
        expect(user1.favoriteMeals).toEqual([]);
    });

    test("w/ missing password", async function() {
        try{
            const user1 = await User.create({
                username: "testuser1",
                email:"testuser1@gmail.com"
            });
        } catch(err) {
            expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        }
    });

});

/******************************************************READ */

describe("Get a User", function() {
    test("Get a user", async () => {
        const testUser = await User.create(user);  
        const foundRes = await User.find({username: "testuser1"});

        expect(foundRes[0].username).toEqual("testuser1");
    })
})

/******************************************************DELETE */

describe("Delete a User", function() {
    test("simple delete", async () => {
        const user1 =  await User.create(user);
        await User.deleteOne({username: "testuser1"});

        const user2 = await User.find({username: "testuser1"});
        expect(user2).toEqual([]);
    })
});


