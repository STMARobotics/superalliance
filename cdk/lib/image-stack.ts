import * as cdk from "aws-cdk-lib";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

interface ImageStackProps extends cdk.StackProps {
  domainName: string;
  imageSubdomain: string;
  robotImageBucketName: string;
  robotImageExpirationDays: number;
  hostedZoneId: string;
  certificate: acm.ICertificate;
  allowedOrigins: string[];
}

export class ImageStack extends cdk.Stack {
  public readonly imageBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: ImageStackProps) {
    super(scope, id, props);

    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, "HostedZone", {
      hostedZoneId: props.hostedZoneId,
      zoneName: props.domainName
    });

    this.imageBucket = new s3.Bucket(this, "RobotImageBucket", {
      bucketName: props.robotImageBucketName,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      lifecycleRules: [
        { expiration: cdk.Duration.days(props.robotImageExpirationDays) }
      ],
      cors: [
        {
          allowedOrigins: props.allowedOrigins,
          allowedMethods: [s3.HttpMethods.PUT],
          allowedHeaders: ["content-type", "cache-control", "x-amz-*"],
          maxAge: 3600
        }
      ]
    });

    const distribution = new cloudfront.Distribution(this, "ImageDistribution", {
      domainNames: [props.imageSubdomain],
      certificate: props.certificate,
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(this.imageBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED
      }
    });

    new route53.ARecord(this, "ImageAliasRecord", {
      zone: hostedZone,
      recordName: props.imageSubdomain,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution))
    });

    new cdk.CfnOutput(this, "RobotImageBucketName", {
      value: this.imageBucket.bucketName
    });
    new cdk.CfnOutput(this, "RobotImageDistributionUrl", {
      value: `https://${props.imageSubdomain}`
    });
  }
}
