export interface AppConfig {
  account: string;
  region: string;
  domainName: string;
  subdomain: string;
  imageSubdomain: string;
  legacyDomainName: string;
  legacyHostedZoneName: string;
  robotImageBucketName: string;
  robotImageExpirationDays: number;
  hostedZoneId: string;
  legacyHostedZoneId: string;
  apiExecutionRoleArn: string;
  backendStackName: string;
  frontendStackName: string;
  redirectStackName: string;
  imageStackName: string;
  certificateStackName: string;
}

export const prodConfig: AppConfig = {
  account: "738044534240",
  region: "us-east-2",
  domainName: "7028robotics.com",
  subdomain: "superalliance.7028robotics.com",
  imageSubdomain: "superalliance-images.7028robotics.com",
  legacyDomainName: "superalliance.stmarobotics.org",
  legacyHostedZoneName: "stmarobotics.org",
  robotImageBucketName: "superalliance-robot-images",
  robotImageExpirationDays: 450,
  hostedZoneId: "Z014656337LGZWAE9JKJP",
  legacyHostedZoneId: "Z058994029BBN6GALXU2Q",
  apiExecutionRoleArn:
    "arn:aws:iam::738044534240:role/superalliance-api-execution-role",
  backendStackName: "superalliance-backend",
  frontendStackName: "superalliance-frontend",
  redirectStackName: "superalliance-redirect",
  imageStackName: "superalliance-images",
  certificateStackName: "superalliance-certificate"
};
