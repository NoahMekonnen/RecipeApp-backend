const express = require("express");
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb+srv://noahmekonnen0:G_zsr9g_FQejfVM@cluster0.elqsx.mongodb.net/');
    // app.use("/user", userRoutes);
}

app.listen(PORT, () => {
    console.log("App is running");
})