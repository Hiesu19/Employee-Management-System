const authRoute = require('./auth.route');

function route(app) {
    app.use('/api/v1/auth', authRoute);
}

module.exports = route;