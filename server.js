const { default: mongoose } = require("mongoose");
const app = require("./app");
const { PORT, getDatabaseUri } = require("./config");


app.listen(PORT, () => {
    console.log(`Running on PORT ${PORT}`);
    mongoose.connect(getDatabaseUri());
});