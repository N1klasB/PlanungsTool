import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class PlanungsAssistenzTool2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, "NiBehTable", {
      tableName: "NiBehTable",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

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

    table.grantReadData(loadLambda);
    table.grantWriteData(saveLambda);

    const restApi = new apigw.RestApi(this, "NiBehApi", {
      restApiName: "NiBehRestApi",
      deployOptions: {
        stageName: "prod",
      },
    });

    const apiKey = restApi.addApiKey("NiBehApiKey", {
      value: "nx32kkfsrdx92hajd83lqw",
    });

    const plan = restApi.addUsagePlan("NiBehUsagePlan", {
      name: "NiBehUsagePlan",
      throttle: {
        rateLimit: 10,
        burstLimit: 2,
      },
    });

    plan.addApiKey(apiKey);
    plan.addApiStage({
      stage: restApi.deploymentStage,
    });

    const loadIntegration = new apigw.LambdaIntegration(loadLambda);
    const load = restApi.root.addResource("load");
    load.addCorsPreflight({
      allowOrigins: apigw.Cors.ALL_ORIGINS,
      allowMethods: ["GET"],
      allowHeaders: [
        "Content-Type",
        "X-Amz-Date",
        "Authorization",
        "X-Api-Key",
      ],
    });

    load.addMethod("GET", loadIntegration, {
      apiKeyRequired: true,
    });

    const saveIntegration = new apigw.LambdaIntegration(saveLambda);
    const save = restApi.root.addResource("save");
    save.addCorsPreflight({
      allowOrigins: apigw.Cors.ALL_ORIGINS,
      allowMethods: ["POST"],
      allowHeaders: [
        "Content-Type",
        "X-Amz-Date",
        "Authorization",
        "X-Api-Key",
      ],
    });

    save.addMethod("POST", saveIntegration, {
      apiKeyRequired: true,
    });

    new cdk.CfnOutput(this, "ApiUrl", {
      value: restApi.url,
    });
  }
}
