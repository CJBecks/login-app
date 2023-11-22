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
    console.log("event", event);

    if (!event.queryStringParameters || !event.queryStringParameters.userId) {
        // failed without an ID
        return Responses._400({ message: 'missing the ID from the path' });
    }

    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            userId: event.queryStringParameters.userId,
        },
    };

    const result = await documentClient.get(params).promise();

    if (!result) {
        return Responses._404({ message: "Failed to get user by ID" });
    }

    return Responses._200(result.Item);
};

const Dynamo = {
    async get(ID, TableName) {
        const params = {
            TableName,
            Key: {
                ID,
            },
        };

        const data = await documentClient.get(params).promise();

        if (!data || !data.Item) {
            throw Error(
                `There was an error fetching the data for ID of ${ID} from ${TableName}`
            );
        }
        console.log(data);

        return data.Item;
    }
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