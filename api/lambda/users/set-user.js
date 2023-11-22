const AWS = require("aws-sdk");

const options = {
    region: process.env.AWS_REGION || "eu-west-1",
};

if (process.env.AWS_SAM_LOCAL) {
    options.endpoint = process.env.DB_ENDPOINT;
    process.env.TABLE_NAME = process.env.LOCAL_TABLE_NAME;
}
const documentClient = new AWS.DynamoDB.DocumentClient(options);

exports.handler = async (event) => {
    console.log('event', event);

    // Parse JSON from the POST request body
    const requestBody = JSON.parse(event.body);

    // Check if required data is present
    if (!requestBody || !requestBody.userId) {
        return Responses._400({ message: 'invalid payload' });
    }

    const newUser = await Dynamo.write(requestBody, process.env.TABLE_NAME).catch(err => {
        console.log('error in dynamo write', err);
        return Responses._400({ message: 'Failed to write user by ID' });
    });

    if (!newUser) {
        return Responses._400({ message: 'Failed to write user by ID' });
    }

    return Responses._200({ newUser });
    
};

const Dynamo = {
    async write(data, TableName) {
        const params = {
            TableName,
            Item: data,
        };

        const res = await documentClient.put(params).promise();

        if (!res) {
            throw Error(
                `There was an error inserting ID of ${data.userId} in table ${TableName}`
            );
        }

        return data;
    },
};

const Responses = {
    _DefineResponse(statusCode = 502, data = {}) {
        return {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*',
            },
            statusCode,
            body: JSON.stringify(data),
        };
    },

    _200(data = {}) {
        return this._DefineResponse(200, data);
    },

    _400(data = {}) {
        return this._DefineResponse(400, data);
    },
    _404(data = {}) {
        return this._DefineResponse(404, data);
    },
};