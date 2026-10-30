#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { BackendStack } from "../lib/backend-stack";
import { CertificateStack } from "../lib/certificate-stack";
import { FrontendStack } from "../lib/frontend-stack";
import { ImageStack } from "../lib/image-stack";
import { prodConfig } from "../lib/config";
import { RedirectStack } from "../lib/redirect-stack";

const app = new cdk.App();
cdk.Tags.of(app).add("AppName", "SuperAlliance");

const certStack = new CertificateStack(app, prodConfig.certificateStackName, {
  env: { account: prodConfig.account, region: "us-east-1" },
  domainName: prodConfig.domainName,
  subdomain: prodConfig.subdomain,
  imageSubdomain: prodConfig.imageSubdomain,
  hostedZoneId: prodConfig.hostedZoneId,
  legacyDomainName: prodConfig.legacyDomainName,
  legacyHostedZoneName: prodConfig.legacyHostedZoneName,
  legacyHostedZoneId: prodConfig.legacyHostedZoneId
});

const imageStack = new ImageStack(app, prodConfig.imageStackName, {
  env: { account: prodConfig.account, region: prodConfig.region },
  domainName: prodConfig.domainName,
  imageSubdomain: prodConfig.imageSubdomain,
  robotImageBucketName: prodConfig.robotImageBucketName,
  robotImageExpirationDays: prodConfig.robotImageExpirationDays,
  hostedZoneId: prodConfig.hostedZoneId,
  certificate: certStack.certificate,
  allowedOrigins: [
    `https://${prodConfig.subdomain}`,
    "http://localhost:5173",
    "http://127.0.0.1:5173"
  ]
});

const backendStack = new BackendStack(app, prodConfig.backendStackName, {
  env: { account: prodConfig.account, region: prodConfig.region },
  imageSubdomain: prodConfig.imageSubdomain,
  imageBucket: imageStack.imageBucket,
  apiExecutionRoleArn: prodConfig.apiExecutionRoleArn
});

new FrontendStack(app, prodConfig.frontendStackName, {
  env: { account: prodConfig.account, region: prodConfig.region },
  domainName: prodConfig.domainName,
  subdomain: prodConfig.subdomain,
  hostedZoneId: prodConfig.hostedZoneId,
  httpApi: backendStack.httpApi,
  certificate: certStack.certificate
});

new RedirectStack(app, prodConfig.redirectStackName, {
  env: { account: prodConfig.account, region: prodConfig.region },
  domainName: prodConfig.legacyDomainName,
  hostedZoneId: prodConfig.legacyHostedZoneId,
  hostedZoneName: prodConfig.legacyHostedZoneName,
  targetDomainName: prodConfig.subdomain,
  certificate: certStack.certificate
});
