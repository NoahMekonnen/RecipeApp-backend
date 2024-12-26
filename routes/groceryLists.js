const express = require("express");
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../expressError");
const GroceryList = require("../models/GroceryList");
const User = require("../models/User");
const { isLoggedIn} = require("../middleware/auth");
const Product = require("../models/Product");
const router = express.Router();



/** POST /groceryLists
 * 
 * {user: id} => {groceryList}
 */
router.post("/", isLoggedIn, async (req, res, next) => {
    try {
        if(!req.body.user) throw new BadRequestError();
        const user = await User.find({_id: req.body.user});
        
        if(!(res.locals.user.username == user[0].username)) throw new UnauthorizedError();
        const groceryList = await GroceryList.create(req.body);
        
        return res.json({groceryList});
    } catch(err) {
        return next(err);
    }
});

/** GET /groceryLists
 * 
 * {userId} => {groceryLists}
 */
router.get("/", isLoggedIn, async (req, res, next) => {
    try{
        const userId = req.query.userId;
        if(!userId) throw new BadRequestError();
        const user = await User.findOne({_id: userId});
        if(!(res.locals.user.username == user.username)) throw new UnauthorizedError();
        const groceryLists = await GroceryList.find({user: userId});

        return res.json({groceryLists});
    } catch(err) {
        return next(err);
    }
});

/** PATCH /groceryLists/:id
 * 
 * {product} => {groceryList}
 */
router.patch("/:id", isLoggedIn, async (req, res, next) => {
    try {
        const id = req.params.id;
        const groceryList = await GroceryList.findOne({_id: id});
        if(!groceryList) throw new NotFoundError();
        if(!req.body.product) throw new BadRequestError();
        const user = await User.findOne({_id: groceryList.user});
        
        if(!(res.locals.user.username == user.username)) throw new UnauthorizedError();
    
        groceryList.products.push(req.body.product._id);
        await groceryList.save();

        return res.json({groceryList});
    } catch(err) {
        return next(err);
    }
});

/** DELETE /groceryLists/:id
 * 
 * output: {deleted: id}
 */
router.delete("/:id", isLoggedIn, async (req, res, next) => {
    try {
        const id = req.params.id;
        const existingGroceryList = await GroceryList.findOne({_id: id}).populate("user");
        if(!existingGroceryList) throw new NotFoundError();
        if(!(res.locals.user.username == existingGroceryList.user.username)) throw new UnauthorizedError();
        await GroceryList.deleteOne({_id: id});
        
        return res.json({deleted:id});
    } catch(err) {
        return next(err);
    }
});

/** DELETE /groceryLists/:id/products/:productId
 * 
 * output: {deleted: id}
 */
router.delete("/:id/products/:productId", isLoggedIn, async (req, res, next) => {
    try {
        const {id, productId} = req.params;
        const groceryList = await GroceryList.findOne({_id: id}).populate('user');
        const product = await Product.findOne({_id:productId});

        if(!groceryList || !product) throw new NotFoundError();
        if(!(res.locals.user.username == groceryList.user.username)) throw new UnauthorizedError();
        const newProducts = groceryList.products.filter(p => p._id != productId);
        groceryList.products = newProducts;
        
        await groceryList.save();

        return res.json({deleted: productId});
    } catch(err) {
        return next(err);
    }
});

module.exports = router;