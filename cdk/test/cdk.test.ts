import * as cdk from "aws-cdk-lib";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import { Template } from "aws-cdk-lib/assertions";
import { BackendStack } from "../lib/backend-stack";
import { CertificateStack } from "../lib/certificate-stack";
import { ImageStack } from "../lib/image-stack";
import { RedirectStack } from "../lib/redirect-stack";

const testExecutionRoleArn =
  "arn:aws:iam::123456789012:role/superalliance-api-execution-role";

const testCertificate = (scope: cdk.App) =>
  acm.Certificate.fromCertificateArn(
    scope,
    "TestCertificate",
    "arn:aws:acm:us-east-1:123456789012:certificate/test"
  );

test("the superalliance certificate uses the configured Route 53 hosted zone ID", () => {
  const app = new cdk.App();
  const stack = new CertificateStack(app, "CertificateStack", {
    env: { account: "123456789012", region: "us-east-1" },
    domainName: "7028robotics.com",
    subdomain: "superalliance.7028robotics.com",
    imageSubdomain: "superalliance-images.7028robotics.com",
    hostedZoneId: "Z014656337LGZWAE9JKJP",
    legacyDomainName: "superalliance.stmarobotics.org",
    legacyHostedZoneName: "stmarobotics.org",
    legacyHostedZoneId: "Z058994029BBN6GALXU2Q"
  });
  const template = Template.fromStack(stack);

  template.hasResourceProperties("AWS::CertificateManager::Certificate", {
    DomainName: "superalliance.7028robotics.com",
    DomainValidationOptions: [
      {
        DomainName: "superalliance.7028robotics.com",
        HostedZoneId: "Z014656337LGZWAE9JKJP"
      },
      {
        DomainName: "superalliance-images.7028robotics.com",
        HostedZoneId: "Z014656337LGZWAE9JKJP"
      },
      {
        DomainName: "superalliance.stmarobotics.org",
        HostedZoneId: "Z058994029BBN6GALXU2Q"
      }
    ]
  });
  template.hasResourceProperties("AWS::CertificateManager::Certificate", {
    SubjectAlternativeNames: [
      "superalliance-images.7028robotics.com",
      "superalliance.stmarobotics.org"
    ]
  });
});

test("the API is an HTTP API using the Express-compatible payload format", () => {
  const app = new cdk.App();
  const imageStack = new ImageStack(app, "ImageStack", {
    domainName: "example.org",
    imageSubdomain: "images.example.org",
    robotImageBucketName: "test-robot-images",
    robotImageExpirationDays: 450,
    hostedZoneId: "Z123456789",
    certificate: testCertificate(app),
    allowedOrigins: ["https://superalliance.example.org"]
  });
  const stack = new BackendStack(app, "BackendStack", {
    imageSubdomain: "images.example.org",
    imageBucket: imageStack.imageBucket,
    apiExecutionRoleArn: testExecutionRoleArn
  });
  const template = Template.fromStack(stack);

  template.resourceCountIs("AWS::ApiGatewayV2::Api", 1);
  template.resourceCountIs("AWS::ApiGatewayV2::Route", 2);

  const routes = Object.values(template.findResources("AWS::ApiGatewayV2::Route"));
  for (const route of routes) {
    expect(route.Properties.AuthorizationType).toBe("NONE");
    expect(route.Properties.Target).toBeDefined();
  }
  expect(routes.map((route) => route.Properties.RouteKey)).toEqual([
    "ANY /api",
    "ANY /api/{proxy+}"
  ]);
  expect(template.findResources("AWS::ApiGateway::RestApi")).toEqual({});

  template.hasResourceProperties("AWS::ApiGatewayV2::Integration", {
    IntegrationType: "AWS_PROXY",
    PayloadFormatVersion: "1.0"
  });
});

test("the API has isolated runtime configuration and required AWS integrations", () => {
  const app = new cdk.App();
  const imageStack = new ImageStack(app, "ImageStack", {
    domainName: "example.org",
    imageSubdomain: "images.example.org",
    robotImageBucketName: "test-robot-images",
    robotImageExpirationDays: 450,
    hostedZoneId: "Z123456789",
    certificate: testCertificate(app),
    allowedOrigins: ["https://superalliance.example.org"]
  });
  const stack = new BackendStack(app, "BackendStack", {
    imageSubdomain: "images.example.org",
    imageBucket: imageStack.imageBucket,
    apiExecutionRoleArn: testExecutionRoleArn
  });
  const template = Template.fromStack(stack);

  template.hasResourceProperties("AWS::Lambda::Function", {
    FunctionName: "superalliance-api",
    Architectures: ["arm64"],
    MemorySize: 512,
    Timeout: 28,
    Environment: {
      Variables: {
        ENVIRONMENT: "production",
        MONGODB_URI: { Ref: "MongoDbUri" },
        CLERK_PUBLISHABLE_KEY: { Ref: "ClerkPublishableKey" },
        CLERK_SECRET_KEY: { Ref: "ClerkSecretKey" },
        TBA_KEY: { Ref: "TbaKey" },
        ROBOT_IMAGE_DISTRO: "images.example.org"
      }
    }
  });

  const apiLambda = Object.values(template.findResources("AWS::Lambda::Function"))
    .find((resource) => resource.Properties.FunctionName === "superalliance-api");
  const apiExecutionRole = Object.entries(template.findResources("AWS::IAM::Role"))
    .find(([, resource]) => resource.Properties.RoleName === "superalliance-api-execution-role");
  expect(apiExecutionRole).toBeDefined();
  expect(apiLambda?.Properties.Role).toEqual({
    "Fn::GetAtt": [apiExecutionRole?.[0], "Arn"]
  });
  template.hasOutput("ApiExecutionRoleArn", {
    Value: { "Fn::GetAtt": [apiExecutionRole?.[0], "Arn"] }
  });
  expect(apiLambda?.Properties.Environment.Variables.CORS_ORIGINS).toBeUndefined();
  expect(apiLambda?.Properties.Environment.Variables.ROBOT_IMAGE_BUCKET).toHaveProperty(
    "Fn::ImportValue"
  );

  for (const parameter of [
    "MongoDbUri",
    "ClerkPublishableKey",
    "ClerkSecretKey",
    "TbaKey"
  ]) {
    template.hasParameter(parameter, { NoEcho: true });
  }
});

test("the legacy hostname redirects through CloudFront to the configured app domain", () => {
  const app = new cdk.App();
  const stack = new RedirectStack(app, "RedirectStack", {
    domainName: "superalliance.stmarobotics.org",
    hostedZoneId: "Z058994029BBN6GALXU2Q",
    hostedZoneName: "stmarobotics.org",
    targetDomainName: "superalliance.7028robotics.com",
    certificate: testCertificate(app)
  });
  const template = Template.fromStack(stack);

  template.hasResourceProperties("AWS::CloudFront::Distribution", {
    DistributionConfig: {
      Aliases: ["superalliance.stmarobotics.org"]
    }
  });
  template.hasResourceProperties("AWS::Route53::RecordSet", {
    Name: "superalliance.stmarobotics.org.",
    HostedZoneId: "Z058994029BBN6GALXU2Q",
    Type: "A"
  });
  const distribution = Object.values(
    template.findResources("AWS::CloudFront::Distribution")
  )[0];
  const [functionAssociation] =
    distribution.Properties.DistributionConfig.DefaultCacheBehavior.FunctionAssociations;
  const functionLogicalId = functionAssociation.FunctionARN["Fn::GetAtt"][0];
  const redirectFunction = template.findResources("AWS::CloudFront::Function")[functionLogicalId];
  expect(functionAssociation.EventType).toBe("viewer-request");
  const functionCode = redirectFunction.Properties.FunctionCode;
  expect(functionCode).toContain("https://superalliance.7028robotics.com");
  expect(functionCode).toContain("request.uri === '/__migrate__'");
  expect(functionCode).toContain("text/html; charset=utf-8");
  expect(functionCode).toContain("target.pathname = params.get('path') || '/'");
  expect(functionCode).toContain("target.search = params.get('search') || ''");
  expect(functionCode).toContain("target.hash = params.get('hash') || ''");
  expect(functionCode).toContain("window.location.replace(target.href)");
  expect(functionCode).toContain("request.uri === '/sw.js'");
  expect(functionCode).toContain("statusCode: 200");
  expect(functionCode).toContain("application/javascript; charset=utf-8");
  expect(functionCode).toContain("no-store, no-cache, must-revalidate, max-age=0");
  expect(functionCode).toContain("self.skipWaiting()");
  expect(functionCode).toContain("self.clients.claim()");
  expect(functionCode).toContain("client.navigate(migrationPage.href).catch((error) =>");
  expect(functionCode).not.toContain("Promise.all(clients.map");
  expect(functionCode).toContain("url.pathname !== '/__migrate__'");
  expect(functionCode).toContain("Response.redirect(migrationUrl(event.request.url), 301)");
  expect(functionCode).toContain("statusCode: 301");
  expect(functionCode).toContain("Moved Permanently");
});

test("the image stack creates a private retained bucket and public CloudFront delivery", () => {
  const app = new cdk.App();
  const stack = new ImageStack(app, "ImageStack", {
    domainName: "example.org",
    imageSubdomain: "images.example.org",
    robotImageBucketName: "test-robot-images",
    robotImageExpirationDays: 450,
    hostedZoneId: "Z123456789",
    certificate: testCertificate(app),
    allowedOrigins: ["https://superalliance.example.org"]
  });
  const template = Template.fromStack(stack);

  template.hasResource("AWS::S3::Bucket", {
    DeletionPolicy: "Retain",
    Properties: {
      BucketName: "test-robot-images",
      LifecycleConfiguration: {
        Rules: [
          {
            ExpirationInDays: 450,
            Status: "Enabled"
          }
        ]
      },
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true
      },
      CorsConfiguration: {
        CorsRules: [
          {
            AllowedHeaders: ["content-type", "cache-control", "x-amz-*"],
            AllowedMethods: ["PUT"],
            AllowedOrigins: ["https://superalliance.example.org"],
            MaxAge: 3600
          }
        ]
      }
    }
  });
  template.hasResourceProperties("AWS::CloudFront::Distribution", {
    DistributionConfig: {
      Aliases: ["images.example.org"]
    }
  });
  template.hasResourceProperties("AWS::Route53::RecordSet", {
    Name: "images.example.org.",
    HostedZoneId: "Z123456789",
    Type: "A"
  });
});
