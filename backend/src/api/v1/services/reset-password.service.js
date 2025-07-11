const crypto = require("crypto");
const bcrypt = require("bcrypt");

const { User } = require("../models/index.model");

const resetPassword = async (employeeIDArray) => {
    const emailArraySuccess = [];
    const idArrayFailed = [];
    for (const employeeID of employeeIDArray) {
        const employeeFound = await User.findOne({ where: { userID: employeeID } });
        if (!employeeFound) {
            idArrayFailed.push(employeeID);
            continue;
        }

        const newPassword = crypto.randomBytes(8).toString("base64").replace(/[^a-zA-Z0-9]/g, '').substring(0, 9);

        //Gửi email
        // ----------------------------------------------------------------------------
        console.log("To: " + employeeFound.email + " - New password: " + newPassword);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        employeeFound.password = hashedPassword;
        employeeFound.mustChangePassword = true;
        await employeeFound.save();
        emailArraySuccess.push(employeeFound.email);
    }

    return {
        "message": `Reset password successfully ${emailArraySuccess.length}/${employeeIDArray.length}`,
        "emailArraySuccess": emailArraySuccess,
        "idArrayFailed": idArrayFailed
    };
}

module.exports = {
    resetPassword
}