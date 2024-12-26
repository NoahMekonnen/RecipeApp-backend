const express = require("express");
const { isLoggedIn } = require("../middleware/auth");
const User = require("../models/User");
const Meal = require("../models/Meal");
const { NotFoundError, UnauthorizedError } = require("../expressError");
const router = express.Router();


/** PATCH /users/:id/meals/:mealId
 * 
 * => {user}
 */
router.patch("/:id/meals/:mealId", isLoggedIn, async (req, res, next) => {
    try {
        const {id, mealId} = req.params;
        const user = await User.findOne({_id:id});
        const meal = await Meal.findOne({_id:mealId});
        if(!meal || !user) throw new NotFoundError();
        if(!(res.locals.user.username == user.username)) throw new UnauthorizedError();

        const existingMeal = await user.favoriteMeals.find((meal) => meal._id == mealId);
        if(!existingMeal){
            user.favoriteMeals.push(meal)
        } else{
            const finalFavoriteMeals = user.favoriteMeals.filter((meal) => !(meal._id == mealId));
            user.favoriteMeals = finalFavoriteMeals;
        }

        await user.save();

        return res.json({user});

    } catch(err) {
        return next(err);
    }
});

module.exports = router;