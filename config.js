require("dotenv").config()

const PORT = process.env.PORT || 3000;


//change to test database 
function getDatabaseUri(){
    return (process.env.NODE_ENV === 'test')
    ? `${process.env.MONGODB_DATABASE_URI}/test`
    : `${process.env.MONGODB_DATABASE_URI}/recipe-mern-app`;
};

module.exports = {
    getDatabaseUri,
    PORT
}