import * as cdk from "aws-cdk-lib";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import { Construct } from "constructs";


// Stack to redirect from superalliance.stmarobotics.org to superalliance.7028robotics.com
interface RedirectStackProps extends cdk.StackProps {
  domainName: string;
  hostedZoneId: string;
  hostedZoneName: string;
  targetDomainName: string;
  certificate: acm.ICertificate;
}

export class RedirectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: RedirectStackProps) {
    super(scope, id, props);

    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, "HostedZone", {
      hostedZoneId: props.hostedZoneId,
      zoneName: props.hostedZoneName
    });

    const redirectFunction = new cloudfront.Function(this, "RedirectFunction", {
      runtime: cloudfront.FunctionRuntime.JS_2_0,
      code: cloudfront.FunctionCode.fromInline(`
function handler(event) {
  var request = event.request;
  if (request.uri === '/__migrate__') {
    return {
      statusCode: 200,
      statusDescription: 'OK',
      headers: {
        'cache-control': { value: 'no-store, no-cache, must-revalidate, max-age=0' },
        'content-type': { value: 'text/html; charset=utf-8' }
      },
      body: {
        encoding: 'text',
        data: \`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Moving SuperAlliance</title>
  </head>
  <body>
    <p>Moving SuperAlliance to its new address. <a href="https://${props.targetDomainName}">Continue</a></p>
    <script>
      const target = new URL('https://${props.targetDomainName}');
      const params = new URLSearchParams(window.location.search);
      target.pathname = params.get('path') || '/';
      target.search = params.get('search') || '';
      target.hash = params.get('hash') || '';
      window.location.replace(target.href);
    </script>
  </body>
</html>\`
      }
    };
  }

  if (request.uri === '/sw.js') {
    return {
      statusCode: 200,
      statusDescription: 'OK',
      headers: {
        'cache-control': { value: 'no-store, no-cache, must-revalidate, max-age=0' },
        'content-type': { value: 'application/javascript; charset=utf-8' }
      },
      body: {
        encoding: 'text',
        data: \`const targetOrigin = 'https://${props.targetDomainName}';

function migrationUrl(url) {
  const destination = new URL(url);
  const target = new URL(targetOrigin);
  destination.protocol = target.protocol;
  destination.host = target.host;
  return destination.href;
}

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    await self.clients.claim();
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    clients.forEach((client) => {
      if (new URL(client.url).origin !== self.location.origin) return;
      const destination = new URL(migrationUrl(client.url));
      const migrationPage = new URL('/__migrate__', self.location.origin);
      migrationPage.searchParams.set('path', destination.pathname);
      migrationPage.searchParams.set('search', destination.search);
      migrationPage.searchParams.set('hash', destination.hash);
      client.navigate(migrationPage.href).catch((error) => {
        console.error('Failed to navigate a legacy app tab to its migration page.', error);
      });
    });
  })());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.mode === 'navigate' && url.pathname !== '/__migrate__') {
    event.respondWith(Response.redirect(migrationUrl(event.request.url), 301));
  }
});\`
      }
    };
  }

  var location = 'https://${props.targetDomainName}' + request.uri;
  var query = [];

  for (var key in request.querystring) {
    var value = request.querystring[key];
    if (value.multiValue) {
      for (var i = 0; i < value.multiValue.length; i++) {
        query.push(key + '=' + value.multiValue[i].value);
      }
    } else {
      query.push(key + '=' + value.value);
    }
  }

  if (query.length > 0) {
    location += '?' + query.join('&');
  }

  return {
    statusCode: 301,
    statusDescription: 'Moved Permanently',
    headers: {
      location: { value: location }
    }
  };
}`)
    });

    const distribution = new cloudfront.Distribution(this, "RedirectDistribution", {
      domainNames: [props.domainName],
      certificate: props.certificate,
      defaultBehavior: {
        origin: new origins.HttpOrigin(props.targetDomainName),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        functionAssociations: [
          {
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
            function: redirectFunction
          }
        ]
      }
    });

    new route53.ARecord(this, "RedirectAliasRecord", {
      zone: hostedZone,
      recordName: props.domainName,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution))
    });
  }
}
