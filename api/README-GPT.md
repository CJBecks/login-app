// https://github.com/SamWSoftware/ServerlessYoutubeSeries/blob/l19-serverless-offline/lambdas/endpoints/sendEmail.js



Certainly! Below is an example of how you can create an AWS CDK app using Node.js that deploys an API Gateway and Lambda functions, and uses AWS SAM for local testing. The API will have endpoints for setting and getting information about a customer, and data will be stored in DynamoDB.

### Prerequisites:

1. Make sure you have Node.js and npm installed: https://nodejs.org/
2. Install AWS CLI: https://aws.amazon.com/cli/
3. Install AWS CDK: `npm install -g aws-cdk`

### Create a new CDK project:

1. Create a new directory for your project:

   ```bash
   mkdir cdk-sam-example
   cd cdk-sam-example
   ```

2. Initialize a new CDK app:

   ```bash
   cdk init --language=typescript
   ```

3. Install necessary CDK and SAM dependencies:

   ```bash
   npm install @aws-cdk/aws-lambda @aws-cdk/aws-apigateway @aws-cdk/aws-dynamodb
   npm install --save-dev aws-cdk-lib
   ```

### Modify `lib/cdk-sam-example-stack.ts`:

Replace the content of `lib/cdk-sam-example-stack.ts` with the following code:

```typescript
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as path from 'path';

export class CdkSamExampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table
    const customerTable = new dynamodb.Table(this, 'CustomerTable', {
      partitionKey: { name: 'customerId', type: dynamodb.AttributeType.STRING },
    });

    // Lambda function for setting customer data
    const setCustomerFunction = new lambda.Function(this, 'SetCustomerFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'set-customer.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '..', 'lambda')),
      environment: {
        TABLE_NAME: customerTable.tableName,
      },
    });

    // Grant permissions to the Lambda function to access DynamoDB
    customerTable.grantReadWriteData(setCustomerFunction);

    // Lambda function for getting customer data
    const getCustomerFunction = new lambda.Function(this, 'GetCustomerFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'get-customer.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '..', 'lambda')),
      environment: {
        TABLE_NAME: customerTable.tableName,
      },
    });

    // Grant permissions to the Lambda function to access DynamoDB
    customerTable.grantReadData(getCustomerFunction);

    // API Gateway
    const api = new apigateway.RestApi(this, 'CustomerApi');
    const setCustomerIntegration = new apigateway.LambdaIntegration(setCustomerFunction);
    const getCustomerIntegration = new apigateway.LambdaIntegration(getCustomerFunction);

    const customerResource = api.root.addResource('customer');
    customerResource.addMethod('POST', setCustomerIntegration);
    customerResource.addMethod('GET', getCustomerIntegration);
  }
}
```

### Create Lambda Function Handlers:

1. Create a new directory `lambda` in your project.

2. Inside the `lambda` directory, create two files `set-customer.js` and `get-customer.js` with the following content:

   `set-customer.js`:

   ```javascript
   const { DynamoDB } = require('aws-sdk');

   exports.handler = async (event) => {
       const dynamoDB = new DynamoDB.DocumentClient();
       const params = {
           TableName: process.env.TABLE_NAME,
           Item: {
               customerId: 'someCustomerId', // You can generate a unique ID here
               data: 'someCustomerData',
           },
       };

       await dynamoDB.put(params).promise();

       return {
           statusCode: 200,
           body: JSON.stringify({ message: 'Customer data added to DynamoDB' }),
       };
   };
   ```

   `get-customer.js`:

   ```javascript
   const { DynamoDB } = require('aws-sdk');

   exports.handler = async (event) => {
       const dynamoDB = new DynamoDB.DocumentClient();
       const params = {
           TableName: process.env.TABLE_NAME,
           Key: {
               customerId: 'someCustomerId', // Replace with the customer ID you want to retrieve
           },
       };

       const result = await dynamoDB.get(params).promise();

       return {
           statusCode: 200,
           body: JSON.stringify(result.Item),
       };
   };
   ```

### Deploy the CDK Stack:

1. In the root of your project, run the following commands to deploy the CDK stack:

   ```bash
   cdk bootstrap
   cdk deploy
   ```

   Follow the prompts to confirm the deployment.

### Test Locally with SAM:

1. Install the AWS SAM CLI if you haven't already: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html

2. In the root of your project, create a `sam-local.yaml` file with the following content:

   ```yaml
   AWSTemplateFormatVersion: '2010-09-09'
   Transform: AWS::Serverless-2016-10-31
   Description: My CDK SAM Example

   Resources:
     MyStack:
       Type: AWS::CloudFormation::Stack
       Properties:
         TemplateURL: ./cdk.out/MyStack.template.json
         TimeoutInMinutes: 10
   ```

3. Start SAM local API:

   ```bash
   sam local start-api --template sam-local.yaml
   ```

4. Use a tool like cURL or Postman to test your local API:

   - To set customer data:

     ```bash
     curl -X POST http://localhost:3000/customer
     ```

   - To get customer data:

     ```bash
     curl http://localhost:3000/customer
     ```

Now you have a CDK project that deploys an API with set/get endpoints for customer data, and you can test it locally using SAM. Note that this is a simple example, and in a production scenario, you may want to enhance error handling, add security, and handle customer IDs more dynamically.