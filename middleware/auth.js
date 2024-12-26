const { UnauthorizedError, BadRequestError } = require("../expressError");
const jwt = require("jsonwebtoken");


/** Middleware that authenticates user
 * 
 * If a token is given verify it 
 * 
 * Error will be thrown if token is not valid 
*/
function authenticateJWT(req, res, next){
    try{
        const authHeader = req.headers && req.headers.authorization;
        if(authHeader){
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            res.locals.user = jwt.verify(token, "secret");
        }
        return next();
    } catch(err){
        return next(err);
    }
}

function isLoggedIn(req, res, next) {
    try{
        if(!res.locals.user) throw new UnauthorizedError();
        return next();
    } catch(err) {
        return next(err);
    }  
}

module.exports = {isLoggedIn, authenticateJWT}