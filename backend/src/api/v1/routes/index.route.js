const authRoute = require('./auth.route');
const departmentRoute = require('./department.route');
const rootRoute = require('./root.route');
const meRoute = require('./me.route');
const reportRoute = require('./report.route.js');

function route(app) {
    app.use('/api/v1/auth', authRoute);
    app.use('/api/v1/departments', departmentRoute);
    app.use('/api/v1/root', rootRoute);
    app.use('/api/v1/me', meRoute);
    app.use('/api/v1/report', reportRoute);
}

module.exports = route;