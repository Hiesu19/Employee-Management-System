const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const db = require("./config/db.config");
const route = require("./api/v1/routes/index.route");
const errorMiddleware = require("./api/v1/middleware/error.middleware");

dotenv.config();

const app = express();

// connect to Postgres
db.connectDB();
db.sequelize.sync();

// app config
app.use(cors(
    {
        origin: process.env.CLIENT_URL,
        credentials: true,
    }
));
app.use(express.json());
app.use(cookieParser());

route(app);

// error middleware
app.use(errorMiddleware);


app.listen(process.env.PORT || 8001, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});





