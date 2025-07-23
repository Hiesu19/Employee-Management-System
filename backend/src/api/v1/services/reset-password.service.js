const crypto = require("crypto");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const { User } = require("../models/index.model");
const { sendEmail } = require("../utils/send-email.utils");

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


        console.log("To: " + employeeFound.email + " - New password: " + newPassword);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        employeeFound.password = hashedPassword;
        employeeFound.mustChangePassword = true;
        await employeeFound.save();
        emailArraySuccess.push({ "email": employeeFound.email, "password": newPassword });
    }

    if (process.env.MODE=== "dev") {
        sendEmail(emailArraySuccess, "reset-password-dev");
    } else {
        sendEmail(emailArraySuccess, "reset-password");
    }

    return {
        "message": `Reset password successfully ${emailArraySuccess.length}/${employeeIDArray.length}`,
        "emailArraySuccess": emailArraySuccess.map(item => item.email),
        "idArrayFailed": idArrayFailed
    };
}

module.exports = {
    resetPassword
}