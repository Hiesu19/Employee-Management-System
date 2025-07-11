const authRoute = require('./auth.route');
const departmentRoute = require('./department.route');
const rootRoute = require('./root.route');

function route(app) {
    app.use('/api/v1/auth', authRoute);
    app.use('/api/v1/departments', departmentRoute);
    app.use('/api/v1/root', rootRoute);
}

module.exports = route;