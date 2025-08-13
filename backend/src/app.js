const dotenv = require("dotenv");
dotenv.config({
    path: process.env.NODE_ENV === "test" ? ".env.test" : ".env"
});
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./doc/swagger');

const db = require("./config/db.config");
const route = require("./api/v1/routes/index.route");
const errorMiddleware = require("./api/v1/middleware/error.middleware");


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

app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;