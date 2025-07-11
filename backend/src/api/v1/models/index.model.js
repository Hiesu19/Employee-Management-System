const Department = require('./Department.model');
const User = require('./User.model');
const RefreshToken = require('./RefreshToken.model');
const CheckInOut = require('./CheckInOut.model');

Department.hasMany(User, {
   foreignKey: 'departmentID',
   onDelete: 'SET NULL',
   onUpdate: 'CASCADE',
});

User.belongsTo(Department, {
   foreignKey: 'departmentID',
   onDelete: 'SET NULL',
});

User.hasMany(CheckInOut, {
   foreignKey: 'userID',
   onDelete: 'SET NULL',
});

CheckInOut.belongsTo(User, {
   foreignKey: 'userID',
   onDelete: 'SET NULL',
});

module.exports = { Department, User, RefreshToken, CheckInOut };