const axios = require("axios");
const request = require("supertest");
const { testUser1, commonBeforeAll, commonAfterAll, commonAfterEach } = require("../_testCommon");
const jwt = require("jsonwebtoken");
const app = require("../app");
const User = require("../models/User");

const TEMP_BASE_URL = "http://localhost:3000";

const SECRET_KEY = "secret";

beforeAll(async () => await commonBeforeAll());
afterEach(async () => await commonAfterEach());
afterAll(async () => await commonAfterAll());

process.env.NODE_ENV = "test"


/******************************************************POST /auth/register*/

describe("Register a user", () => {
    test("w/ valid creds", async () => {
        const resp = await request(app)
                        .post("/auth/register")
                        .send(testUser1);
        const user = jwt.verify(resp.body.token, SECRET_KEY)

        expect(user.username).toEqual(testUser1.username);
    });

    test("w/ missing info", async () => {
        const resp = await request(app)
                        .post("/auth/register")
                        .send({
                            username: "fail",
                            password: "fail"
                        });
        
        expect(resp.status).toEqual(400);
    });
});

/******************************************************POST /auth/login */

describe("Login", () => {
    test("w/ valid creds", async () => {
        await User.create(testUser1);
        const resp = await request(app)
                            .post("/auth/login")
                            .send({
                                username: "testuser1",
                                password: "password"
                            });
        const user = jwt.verify(resp.body.token, SECRET_KEY);

        expect(user.username).toEqual(testUser1.username);
    });

    test("w/ missing creds", async () => {
        await User.create(testUser1);
        const resp = await request(app)
                            .post("/auth/login")
                            .send({username: "testuser1"});
             
        expect(resp.status).toEqual(400);
    });

    test("w/ invalid creds", async () => {
        await User.create(testUser1);
        const resp = await request(app)
                            .post("/auth/login")
                            .send({
                                username: "testuser1",
                                password: "fail"
                            });
             
        expect(resp.status).toEqual(404);
    });
});


