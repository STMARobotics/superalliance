import * as cdk from "aws-cdk-lib";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";

interface CertificateStackProps extends cdk.StackProps {
  domainName: string;
  subdomain: string;
  imageSubdomain: string;
  legacyDomainName: string;
  legacyHostedZoneName: string;
  legacyHostedZoneId: string;
  hostedZoneId: string;
}

export class CertificateStack extends cdk.Stack {
  public readonly certificate: acm.ICertificate;

  constructor(scope: Construct, id: string, props: CertificateStackProps) {
    super(scope, id, props);

    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, "HostedZone", {
      hostedZoneId: props.hostedZoneId,
      zoneName: props.domainName
    });
    const legacyHostedZone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      "LegacyHostedZone",
      {
        hostedZoneId: props.legacyHostedZoneId,
        zoneName: props.legacyHostedZoneName
      }
    );

    this.certificate = new acm.Certificate(this, "RecoveredSiteCertificate", {
      domainName: props.subdomain,
      subjectAlternativeNames: [props.imageSubdomain, props.legacyDomainName],
      validation: acm.CertificateValidation.fromDnsMultiZone({
        [props.subdomain]: hostedZone,
        [props.imageSubdomain]: hostedZone,
        [props.legacyDomainName]: legacyHostedZone
      })
    });
  }
}
