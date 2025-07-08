const express = require("express");
const cors = require("cors");

const db = require("./config/db.config");
const route = require("./api/v1/routes/index.route");
const errorMiddleware = require("./api/v1/middleware/error.middleware");

const app = express();

db.connectDB();
db.sequelize.sync();

// app config
app.use(cors());
app.use(express.json());

route(app);

app.use(errorMiddleware);

app.listen(8001, () => {
    console.log(`Server is running on http://localhost:8001`);
});





