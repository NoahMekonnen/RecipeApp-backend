const express = require("express");
const { authenticateJWT } = require("./middleware/auth");
require('dotenv').config()

const app = express();

const authRoutes = require("./routes/auth");
const groceryRoutes = require("./routes/groceryLists");
const productRoutes =  require("./routes/products");
const mealRoutes = require("./routes/meals");
const userRoutes = require("./routes/users");

app.use(express.json());
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/groceryLists", groceryRoutes);
app.use("/products", productRoutes);
app.use("/meals", mealRoutes);
app.use("/users", userRoutes);

//cors
// routes

//final error handling
// delete unneccessary testing for models after or add later
// make backend in general look cleaner(formatting, change order of imports, etc) 
// maybe add testing for proper status codes

app.use(function(err, req, res, next){
    if(process.env.NODE_ENV !== "test") console.log(err.stack);
    if(err.message && err.message.includes("validation failed")) err.status = 400;
    const status = err.status || 500;
    const msg = err.message;
    return res.status(status).json({
        error: { msg, status }
    });
});

module.exports = app;