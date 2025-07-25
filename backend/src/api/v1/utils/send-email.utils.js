const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
require('dotenv').config();

const sqsClient = new SQSClient({
    region: "ap-southeast-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID_SQS,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_SQS
    }
});

const queueURL = process.env.AWS_SQS_QUEUE_URL;

const sendEmail = async (data, type) => {

    if (!data) {
        throw new Error('Data parameter is required');
    }

    if (!type) {
        throw new Error('Type parameter is required');
    }

    let messageData = [];

    if (type === "reset-password") {
        messageData = {
            "type": "reset-password",
            "datas": data
        }
    } else if (type === "new-user") {
        messageData = {
            "type": "new-user",
            "datas": data
        }
    } else if (type === "reset-password-dev") {
        messageData = {
            "type": "reset-password-dev",
            "datas": data
        }
    } else if (type === "new-user-dev") {
        messageData = {
            "type": "new-user-dev",
            "datas": data
        }
    } else {
        throw new Error(`Unsupported message type: ${type}`);
    }

    const command = new SendMessageCommand({
        QueueUrl: queueURL,
        MessageBody: JSON.stringify(messageData)
    });

    try {
        const result = await sqsClient.send(command);
        return result;
    } catch (err) {
        console.error('Failed to send SQS message:', err);
        throw new Error(`SQS send failed: ${err.message || err}`);
    }
}

const sendEmailHTML = async (data, type) => {
    let messageData = [];

    if (type === "html") {
        messageData = {
            "type": "html",
            "datas": data
        }
    } else if (type === "html-dev") {
        messageData = {
            "type": "html-dev",
            "datas": data
        }
    } else {
        throw new Error(`Unsupported message type: ${type}`);
    }

    const command = new SendMessageCommand({
        QueueUrl: queueURL,
        MessageBody: JSON.stringify(messageData)
    });

    try {
        const result = await sqsClient.send(command);
        return result;
    } catch (err) {
        console.error('Failed to send SQS message:', err);
        throw new Error(`SQS send failed: ${err.message || err}`);
    }
}

module.exports = { sendEmail, sendEmailHTML };
