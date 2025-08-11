const app = require("./app");


app.listen(process.env.PORT || 8001, () => {
    console.log("Server is running MODE: " + (process.env.NODE_ENV || "production"));
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});





