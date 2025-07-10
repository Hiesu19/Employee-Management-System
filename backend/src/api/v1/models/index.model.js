const Department = require('./Department.model');
const User = require('./User.model');
const RefreshToken = require('./RefreshToken.model');

Department.hasMany(User, { 
    foreignKey: 'departmentID',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
 });

 User.belongsTo(Department, {
    foreignKey: 'departmentID',
    onDelete: 'SET NULL',
 });

 module.exports = { Department, User, RefreshToken };