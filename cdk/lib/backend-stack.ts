import * as cdk from "aws-cdk-lib";
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as logs from "aws-cdk-lib/aws-logs";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import * as path from "path";

interface BackendStackProps extends cdk.StackProps {
  imageSubdomain: string;
  imageBucket: s3.IBucket;
  apiExecutionRoleArn: string;
}

export class BackendStack extends cdk.Stack {
  public readonly httpApi: apigwv2.HttpApi;

  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);

    const mongoDbUri = this.addSecretParameter("MongoDbUri", "MongoDB connection URI");
    const clerkPublishableKey = this.addSecretParameter(
      "ClerkPublishableKey",
      "Clerk production publishable key"
    );
    const clerkSecretKey = this.addSecretParameter(
      "ClerkSecretKey",
      "Clerk production secret key"
    );
    const tbaKey = this.addSecretParameter("TbaKey", "The Blue Alliance API key");
    const apiLogGroup = new logs.LogGroup(this, "ApiLogGroup", {
      logGroupName: "/aws/lambda/superalliance-api",
      retention: logs.RetentionDays.ONE_MONTH,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
    const executionRoleArn = cdk.Arn.split(
      props.apiExecutionRoleArn,
      cdk.ArnFormat.SLASH_RESOURCE_NAME
    );
    if (
      executionRoleArn.service !== "iam" ||
      executionRoleArn.resource !== "role" ||
      !executionRoleArn.resourceName ||
      (!cdk.Token.isUnresolved(this.account) && executionRoleArn.account !== this.account) ||
      (!cdk.Token.isUnresolved(this.partition) &&
        executionRoleArn.partition !== this.partition)
    ) {
      throw new Error(`Invalid API execution role ARN: ${props.apiExecutionRoleArn}`);
    }
    const apiExecutionRole = new iam.Role(this, "ApiExecutionRole", {
      roleName: executionRoleArn.resourceName,
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com")
    });
    apiLogGroup.grantWrite(apiExecutionRole);

    const apiFunction = new nodejs.NodejsFunction(this, "ExpressApiFunction", {
      functionName: "superalliance-api",
      runtime: lambda.Runtime.NODEJS_24_X,
      architecture: lambda.Architecture.ARM_64,
      entry: path.join(__dirname, "../../api/lambda.js"),
      handler: "handler",
      depsLockFilePath: path.join(__dirname, "../../package-lock.json"),
      logGroup: apiLogGroup,
      role: apiExecutionRole,
      memorySize: 512,
      timeout: cdk.Duration.seconds(28),
      environment: {
        CLERK_PUBLISHABLE_KEY: clerkPublishableKey.valueAsString,
        CLERK_SECRET_KEY: clerkSecretKey.valueAsString,
        ENVIRONMENT: "production",
        MONGODB_URI: mongoDbUri.valueAsString,
        ROBOT_IMAGE_BUCKET: props.imageBucket.bucketName,
        ROBOT_IMAGE_DISTRO: props.imageSubdomain,
        TBA_KEY: tbaKey.valueAsString
      }
    });

    props.imageBucket.grantPut(apiFunction);
    apiFunction.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["bedrock:InvokeModel"],
        resources: [
          `arn:${this.partition}:bedrock:*::foundation-model/amazon.nova-pro-v1:0`,
          `arn:${this.partition}:bedrock:*::foundation-model/deepseek.v3-v1:0`,
          `arn:${this.partition}:bedrock:${this.region}:${this.account}:inference-profile/us.amazon.nova-pro-v1:0`
        ]
      })
    );

    this.httpApi = new apigwv2.HttpApi(this, "ExpressHttpApi", {
      apiName: "superalliance-api",
      createDefaultStage: true
    });

    const integration = new integrations.HttpLambdaIntegration(
      "ExpressApiIntegration",
      apiFunction,
      { payloadFormatVersion: apigwv2.PayloadFormatVersion.VERSION_1_0 }
    );

    this.httpApi.addRoutes({
      path: "/api",
      methods: [apigwv2.HttpMethod.ANY],
      integration
    });
    this.httpApi.addRoutes({
      path: "/api/{proxy+}",
      methods: [apigwv2.HttpMethod.ANY],
      integration
    });

    new cdk.CfnOutput(this, "ApiUrl", {
      value: this.httpApi.apiEndpoint
    });
    new cdk.CfnOutput(this, "ApiExecutionRoleArn", {
      value: apiExecutionRole.roleArn
    });
  }

  private addSecretParameter(id: string, description: string): cdk.CfnParameter {
    return new cdk.CfnParameter(this, id, {
      type: "String",
      description,
      noEcho: true
    });
  }
}
