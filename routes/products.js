const express = require("express");
const { isLoggedIn } = require("../middleware/auth");
const { BadRequestError, UnauthorizedError, NotFoundError } = require("../expressError");
const Product = require("../models/Product");
const router = express.Router();
const axios = require("axios");
const GroceryList = require("../models/GroceryList");
require("dotenv").config();


/** POST /products
 * 
 * {title, image, groceryListId} => {product}
 */
router.post("/", isLoggedIn, async (req, res, next) => {
    try{
        const {title, image, groceryListId} = req.body;
        const product = await Product.create({
            title, image, groceryList: groceryListId
        });
       
        return res.json({product});
    } catch(err) {
        return next(err);
    }
});

/** GET /products
 * 
 * {filter, number} => {products}
 */
router.get("/", async (req, res, next) => {
    try {
        const {filter, number} = req.query;
        if(!max) throw new BadRequestError();
        const resp = await axios.get(`
            ${process.env.MONGODB_DATABASE_URI}/food/products/search?apiKey=${process.env.SPOONACULAR_API_KEY}&query=${filter}&number=${number}`);
        const products = resp.data.products;
        for(let product of products) {
            const databaseProduct = await Product.findOne({title: product.title});
            if(!databaseProduct.title) {
                await Product.create({title: product.title, image: "http://dummyimage.com/249x100.png/dddddd/000000"});
            }
        }
        return res.json({products});
    } catch(err) {
        return next(err);
    }
});

/** PATCH /products/:id 
 * 
 * {groceryListId} => {product}
 */
router.patch("/:id", isLoggedIn, async (req, res, next) => {
    try {
        const id = req.params.id;
        const product = await Product.findOne({_id: id});
        if(!product) throw new NotFoundError();
        const groceryListId = req.body.groceryListId;
        const groceryList = await GroceryList.findOne({_id: groceryListId}).populate('user');
        if(!(res.locals.user.username == groceryList.user.username)) throw new UnauthorizedError();
        product.groceryList = groceryListId;
        await product.save();

        return res.json({product});
    } catch(err) {
        return next(err);
    }
});

module.exports = router;