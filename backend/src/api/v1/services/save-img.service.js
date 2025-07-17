const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');


const { ResponseError } = require('../error/ResponseError.error');
const { User } = require('../models/index.model');

require('dotenv').config();

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID_S3,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_S3
    }
});

const uploadAvatarImage = async (file, userID) => {
    try {
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `avatars/${userID}.${fileExtension}`;

        const upload = new Upload({
            client: s3,
            params: {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read'
            }
        });

        await upload.done();

        const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
        return url;
    } catch (error) {
        console.error(error);
        throw new ResponseError(500, 'Failed to upload avatar image');
    }
};

const updateAvatarLink = async (userID, file) => {
    const employee = await User.findOne({ where: { userID: userID } });
    if (!employee) {
        throw new ResponseError(404, "Employee not found");
    }

    const newAvatarURL = await uploadAvatarImage(file, userID);

    employee.avatarURL = newAvatarURL || employee.avatarURL;
    await employee.save();

    const result = {
        userID: employee.userID,
        fullName: employee.fullName,
        email: employee.email,
        phone: employee.phone,
        role: employee.role,
        mustChangePassword: employee.mustChangePassword,
        avatarURL: employee.avatarURL,
        createdAt: employee.createdAt,
        updatedAt: employee.updatedAt,
    }
    return result;
}

module.exports = { updateAvatarLink };
