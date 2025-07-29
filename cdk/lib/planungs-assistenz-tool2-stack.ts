import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as cognito from "aws-cdk-lib/aws-cognito";

export class PlanungsAssistenzTool2Stack extends cdk.Stack {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table
    const table = new dynamodb.Table(this, "NiBehTable", {
      tableName: "NiBehTable",
      partitionKey: { name: "userName", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Lambda Functions
    const loadLambda = new lambda.Function(this, "NiBehReadLambda", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "load.handler",
      code: lambda.Code.fromAsset("lambda"),
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    const saveLambda = new lambda.Function(this, "NiBehWriteLambda", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "save.handler",
      code: lambda.Code.fromAsset("lambda"),
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    const editLambda = new lambda.Function(this, "NiBehEditLambda", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "edit.handler",
      code: lambda.Code.fromAsset("lambda"),
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    table.grantReadData(loadLambda);
    table.grantWriteData(saveLambda);
    table.grantWriteData(editLambda);

    // Cognito User Pool
    this.userPool = new cognito.UserPool(this, "NiBehUserPool", {
      selfSignUpEnabled: false,
      signInAliases: {
        username: true,
      },
      autoVerify: {},
    });

    this.userPoolClient = new cognito.UserPoolClient(
      this,
      "NiBehUserPoolClient",
      {
        userPool: this.userPool,
        generateSecret: false,
        authFlows: {
          userSrp: true,
        },
        oAuth: {
          callbackUrls: ["http://localhost:3000/callback"],
          logoutUrls: ["http://localhost:3000/logout"], //noch nicht in use
          flows: {
            implicitCodeGrant: true,
          },
          scopes: [cognito.OAuthScope.OPENID],
        },
      }
    );

    new cognito.CfnUserPoolDomain(this, "NiBehUserPoolDomain", {
      domain: "ni-beh-app-login",
      userPoolId: this.userPool.userPoolId,
    });

    // API Gateway
    const restApi = new apigw.RestApi(this, "NiBehApi", {
      restApiName: "NiBehRestApi",
      deployOptions: {
        stageName: "prod",
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS,
        allowHeaders: ["Content-Type", "Authorization"],
      },
    });

    //Authorizer
    const authorizer = new apigw.CognitoUserPoolsAuthorizer(
      this,
      "NiBehAuthorizer",
      {
        cognitoUserPools: [this.userPool],
      }
    );

    // GET /load Endpoint
    const load = restApi.root.addResource("load");
    load.addMethod("GET", new apigw.LambdaIntegration(loadLambda), {
      authorizer,
      authorizationType: apigw.AuthorizationType.COGNITO,
    });

    // POST /save Endpoint
    const save = restApi.root.addResource("save");
    save.addMethod("POST", new apigw.LambdaIntegration(saveLambda), {
      authorizer,
      authorizationType: apigw.AuthorizationType.COGNITO,
    });

    const edit = restApi.root.addResource("edit");
    edit.addMethod("POST", new apigw.LambdaIntegration(editLambda), {
      authorizer,
      authorizationType: apigw.AuthorizationType.COGNITO,
    })

    // CloudFormation Outputs
    new cdk.CfnOutput(this, "ApiUrl", {
      value: restApi.url,
    });

    new cdk.CfnOutput(this, "UserPoolId", {
      value: this.userPool.userPoolId,
    });

    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: this.userPoolClient.userPoolClientId,
    });
  }
}
