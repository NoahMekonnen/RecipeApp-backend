const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const { BadRequestError, NotFoundError } = require("../expressError");

const router = express.Router();

// maybe use bcrypt

/** Registers a user
 * 
 * input: {username, password, email}
 * output: {token}
 */
router.post("/register", async (req, res, next) => {
    try{
        const user = await User.create(req.body);
        const token = jwt.sign(req.body, "secret");
        console.log("here")
        return res.json({token});
    } catch(err) {
        if (err instanceof mongoose.Error.ValidationError) err.status = 400;
        return next(err);
    }
});

/** Login 
 * 
 * input: {username, password}
 * output: {token}
 */
router.post("/login", async (req, res, next) => {
    try{
        const {username, password} = req.body;
        let user;
        if(password) {
            user = await User.find(req.body);
        } else throw new BadRequestError();
       
        if(user.length == 0) throw new NotFoundError();
        const token = jwt.sign(req.body, "secret");
        res.locals.user = user[0];
        return res.json({token});
    } catch(err) {
        return next(err);
    }
})

module.exports = router;