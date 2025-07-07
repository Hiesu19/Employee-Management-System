const express = require("express");
const connectDB = require("./config/db.config");

const app = express();

connectDB();

app.listen(8001, () => {
    console.log(`Server is running on http://localhost:8001`);
});





