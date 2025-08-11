require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT || "postgres",
        logging: false,
    },
    test: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT || "postgres",
        logging: false,
    },
    production: {
        // Thêm cấu hình production nếu cần
    }
};
