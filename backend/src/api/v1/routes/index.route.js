const authRoute = require('./auth.route');
const departmentRoute = require('./department.route');

function route(app) {
    app.use('/api/v1/auth', authRoute);
    app.use('/api/v1/departments', departmentRoute);
}

module.exports = route;