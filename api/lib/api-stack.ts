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
    const usersTable = new dynamodb.Table(this, "Users", {
      partitionKey: { name: "userId", type: dynamodb.AttributeType.STRING },
    });

    // Lambda function for setting customer data
    const setUserFunction = new lambda.Function(
      this,
      "SetUserFunction",
      {
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: "set-user.handler",
        code: lambda.Code.fromAsset(path.join(__dirname, "..", "lambda/users")),
        environment: {
          TABLE_NAME: usersTable.tableName,
          DB_ENDPOINT: dbEndpoint,
          LOCAL_TABLE_NAME: USERS_TABLE_NAME,
        },
      }
    );

    // Grant permissions to the Lambda function to access DynamoDB
    usersTable.grantReadWriteData(setUserFunction);

    // Lambda function for getting customer data
    const getUserFunction = new lambda.Function(
      this,
      "GetUserFunction",
      {
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: "get-user.handler",
        code: lambda.Code.fromAsset(path.join(__dirname, "..", "lambda/users")),
        environment: {
          TABLE_NAME: usersTable.tableName,
          DB_ENDPOINT: dbEndpoint,
          LOCAL_TABLE_NAME: USERS_TABLE_NAME,
        },
      }
    );

    // Grant permissions to the Lambda function to access DynamoDB
    usersTable.grantReadData(getUserFunction);

    // API Gateway
    const api = new apigateway.RestApi(this, "CustomerApi");
    const setCustomerIntegration = new apigateway.LambdaIntegration(
      setUserFunction
    );
    const getCustomerIntegration = new apigateway.LambdaIntegration(
      getUserFunction
    );

    const customerResource = api.root.addResource("customer");
    customerResource.addMethod("POST", setCustomerIntegration);
    customerResource.addMethod("GET", getCustomerIntegration);
  }
}
