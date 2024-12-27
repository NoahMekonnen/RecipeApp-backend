const express = require("express");
const Meal = require("../models/Meal");
const { BadRequestError, NotFoundError } = require("../expressError");
const queryHelper = require("../utils/queryHelper");
const { isLoggedIn } = require("../middleware/auth");
const User = require("../models/User");
const router = express.Router();
const axios = require("axios");


/** POST /meals
 * 
 * {title, image, ingredients} => {meal}
 */
router.post("/", async (req, res, next) => {
    try {
        const {title, image, id} = req.body;
        const meal = await Meal.create({title, image, spoonacularId: id});

        return res.status(201).json({meal});
    } catch(err) {
        return next(err);
    }
});

/** GET /meals
 * 
 * {filter} => {meals}
 */
router.get("/", async (req, res, next) => {
    try {
        if(!req.query.number) throw new BadRequestError();
        const queryStack = queryHelper(req.query);
        const resp = await axios.get(`${process.env.SPOONACULAR_BASE_URL}/recipes/complexSearch?apiKey=${process.env.SPOONACULAR_API_KEY}${queryStack}`);
        const meals = resp.data.results;
        
        for(let meal of meals){
            const databaseMeal = await Meal.findOne({title: meal.title});
            if(!databaseMeal) {
                await Meal.create({title: meal.title, image: meal.image, spoonacularId: meal.id});
            }
        }
        return res.json({meals});
    } catch(err) {
        return next(err);
    }
});


/** GET /meals/:id
 * 
 * => {meal}
 */
router.get("/:id", async (req, res, next) => {
    try {
        const meal = await Meal.findOne({spoonacularId: req.params.id});
        if(!meal) throw new NotFoundError();
    
        const resp = await axios.get(
            `${process.env.SPOONACULAR_BASE_URL}/recipes/${meal.spoonacularId}/information?apiKey=${process.env.SPOONACULAR_API_KEY}`);
        console.log(typeof meal.ingredients)
        for (let ingredient of resp.data.extendedIngredients) {
            meal.ingredients.push(ingredient.name);
        }

        await meal.save();

        return res.json({meal});
    } catch(err) {
        return next(err);
    }
})

module.exports = router;