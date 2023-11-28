import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export class CognitoUserPoolStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, 'finance-user-pool', {
      userPoolName: 'finance-user-pool',
      signInAliases: {
        email: true,
      },
      selfSignUpEnabled: true,
      autoVerify: {
        email: true,
      },
      userVerification: {
        emailSubject: 'You need to verify your email',
        emailBody: 'Thanks for signing up Your verification code is {####}', // # This placeholder is a must if code is selected as preferred verification method
        emailStyle: cognito.VerificationEmailStyle.CODE,
      },
      standardAttributes: {
        email: {
          mutable: false,
          required: true,
        }
      },
      customAttributes: {
        'name': new cognito.StringAttribute({
          mutable: true,
          minLen: 1,
          maxLen: 150,
        }),
        // 'tenantId': new cognito.StringAttribute({
        //   mutable: false,
        //   minLen: 10,
        //   maxLen: 15,
        // }),
        // 'createdAt': new cognito.DateTimeAttribute(),
        // 'employeeId': new cognito.NumberAttribute({
        //   mutable: false,
        //   min: 1,
        //   max: 100,
        // }),
        // 'isAdmin': new cognito.BooleanAttribute({
        //   mutable: false,
        // }),
      },
      passwordPolicy: {
        minLength: 6,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: false,
        requireSymbols: false,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const appClient = userPool.addClient('finance-user-pool', {
      userPoolClientName: 'finance-user-pool',
      // authFlows: {
      //   userPassword: true,
      // },
    });

    // Output the User Pool ID
    new cdk.CfnOutput(this, 'FinanceUserPoolArn', {
      exportName: 'FinanceUserPoolArn',
      value: userPool.userPoolArn,
      description: 'User Pool Arn',
    });

    new cdk.CfnOutput(this, 'FinanceUserPoolId', {
      exportName: 'FinanceUserPoolId',
      value: userPool.userPoolId,
      description: 'User Pool Id',
    });
    
    new cdk.CfnOutput(this, 'FinanceUserPoolProviderName', {
      exportName: 'FinanceUserProviderName',
      value: userPool.userPoolProviderName,
      description: 'User Pool Provider Name',
    });
  }
}
