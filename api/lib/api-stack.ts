import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as path from "path";
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import {
  DEV_ENV,
  OSX_DB_ENDPOINT,
  WINDOWS_DB_ENDPOINT,
  DEFAULT_DB_ENDPOINT,
  USERS_TABLE_NAME,
} from "./config";

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Choose the appropriate DB endpoint based on the dev environment
    const dbEndpoint =
      DEV_ENV === "OSX"
        ? OSX_DB_ENDPOINT
        : DEV_ENV === "Windows"
        ? WINDOWS_DB_ENDPOINT
        : DEFAULT_DB_ENDPOINT;

    // DynamoDB Table
    const customerTable = new dynamodb.Table(this, "CustomerTable", {
      partitionKey: { name: "customerId", type: dynamodb.AttributeType.STRING },
    });

    // Lambda function for setting customer data
    const setCustomerFunction = new lambda.Function(
      this,
      "SetCustomerFunction",
      {
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: "set-user.handler",
        code: lambda.Code.fromAsset(path.join(__dirname, "..", "lambda/users")),
        environment: {
          TABLE_NAME: customerTable.tableName,
          DB_ENDPOINT: dbEndpoint,
          LOCAL_TABLE_NAME: USERS_TABLE_NAME,
        },
      }
    );

    // Grant permissions to the Lambda function to access DynamoDB
    customerTable.grantReadWriteData(setCustomerFunction);

    // Lambda function for getting customer data
    const getCustomerFunction = new lambda.Function(
      this,
      "GetCustomerFunction",
      {
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: "get-user.handler",
        code: lambda.Code.fromAsset(path.join(__dirname, "..", "lambda/users")),
        environment: {
          TABLE_NAME: customerTable.tableName,
          DB_ENDPOINT: dbEndpoint,
          LOCAL_TABLE_NAME: USERS_TABLE_NAME,
        },
      }
    );

    // Grant permissions to the Lambda function to access DynamoDB
    customerTable.grantReadData(getCustomerFunction);

    // API Gateway
    const api = new apigateway.RestApi(this, "CustomerApi");
    const setCustomerIntegration = new apigateway.LambdaIntegration(
      setCustomerFunction
    );
    const getCustomerIntegration = new apigateway.LambdaIntegration(
      getCustomerFunction
    );

    const customerResource = api.root.addResource("customer");
    customerResource.addMethod("POST", setCustomerIntegration);
    customerResource.addMethod("GET", getCustomerIntegration);
  }
}
