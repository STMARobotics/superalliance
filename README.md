# Scouting App 2026
Here at robotics, scouting is a very important intelligence operation which offers a significant edge when competing. The 2026 Scouting App does exactly this, employing our team members to analyze and take note of robots during matches. In doing so, they collectively gather and construct an extensive repository of robot strategies & approaches. The application allows those members to record that data but also reference and index such data to make decisions about team alliances, individual match strategies, consider successful practices other robots are implementing, and more. 

## Overview
The SuperAlliance is a cloud-based application deployed to AWS that is made up of a [React](https://react.dev/) frontend, [Node.js](https://nodejs.org/) API, and [MongoDB](https://www.mongodb.com/) database. Users interact with the React frontend application, the frontend calls the API to send/recieve data, and the API interacts with the database to read/update data. The frontend is deployed to [Amazon S3](https://aws.amazon.com/s3/) as a static website served by [AWS CloudFront](https://aws.amazon.com/cloudfront/) CDN. The API is deployed to [AWS Lambda](https://aws.amazon.com/lambda/) and is exposed using [AWS API Gateway](https://aws.amazon.com/api-gateway/).The database runs on [MongoDB Atlas](https://www.mongodb.com/) cloud platform.

## Build and Deployment

SuperAlliance is the only deployment managed by this repository:

| Deployment | URL | Infrastructure owner | Data |
| --- | --- | --- | --- |
| SuperAlliance | `https://superalliance.7028robotics.com` | AWS CDK (`superalliance-certificate`, `superalliance-images`, `superalliance-backend`, `superalliance-frontend`) | MongoDB Atlas |

CDK tags SuperAlliance resources with `AppName=SuperAlliance`. The SuperAlliance frontend is built into
S3 and served through CloudFront; `/api/*` is forwarded to an API Gateway HTTP
API and the existing Express app in one Lambda. The HTTP API uses payload
format `1.0`, which is compatible with the `aws-serverless-express` Lambda
adapter. SuperAlliance does not use REST API Gateway or Claudia.js.

The CDK configuration and stacks are in `cdk/`. The certificate stack is in
`us-east-1` for CloudFront; the images, backend, and frontend stacks are in
`us-east-2`.
The deployed frontend resolves its API origin from the page origin and uses
the `/api` path. CloudFront routes that path to the API Gateway HTTP API, so no
production `VITE_API_URL` build variable is needed. The app and API use the
configured Clerk production instance and MongoDB Atlas database.

### SuperAlliance GitHub Actions configuration

The `SuperAlliance CDK` workflow validates changes and deploys the separate SuperAlliance
stacks from `main`. It uses the repository's existing
`superalliance-api-github-actions-role` for AWS OIDC federation. The role and
account `738044534240` need permissions to run CDK/CloudFormation deployments
and access the CDK bootstrap resources in both `us-east-1` and `us-east-2`.
Bootstrap each region once if it has not already been bootstrapped:

```bash
npx cdk bootstrap aws://738044534240/us-east-1
npx cdk bootstrap aws://738044534240/us-east-2
```

Configure these GitHub Actions repository secrets for SuperAlliance (the app and API
secrets are not read from the old Lambda):

| Secret | Use |
| --- | --- |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key used by the frontend and API Lambda |
| `CLERK_SECRET_KEY` | Clerk secret key passed to the API Lambda |
| `MONGODB_URI` | Existing shared MongoDB connection string |
| `TBA_KEY` | The Blue Alliance API key |

The deployment passes server-side values as CloudFormation `NoEcho`
parameters, then into the Lambda environment. This masks them in CloudFormation
views but is not a secrets service: principals permitted to inspect or update
the Lambda configuration can still access the environment values. This keeps
the current GitHub-secrets-to-Lambda configuration without adding Secrets
Manager.

The API Lambda uses the IAM role whose ARN is configured as
`apiExecutionRoleArn` in `cdk/lib/config.ts`. The backend stack creates and
manages this role, and also publishes its ARN as the `ApiExecutionRoleArn`
output of the `superalliance-backend` CloudFormation stack. Retrieve it with:

```bash
aws cloudformation describe-stacks \
  --stack-name superalliance-backend \
  --query "Stacks[0].Outputs[?OutputKey=='ApiExecutionRoleArn'].OutputValue | [0]" \
  --output text
```

### Clerk setup required before first use

In the Clerk **Production** instance used by SuperAlliance:

1. Add `https://superalliance.7028robotics.com` to the application's allowed origins.
2. Keep the existing production publishable/secret key pair configured as the
   GitHub secrets above.
3. Confirm the production instance has the same Admin users with
   `public_metadata.role` set to `admin`; the SuperAlliance API continues to enforce
   this role with Clerk.

The deployment creates a separate S3 bucket named `superalliance-robot-images` for new
robot images. The bucket remains private; CloudFront serves its images publicly
at `https://superalliance-images.7028robotics.com`, while the API grants signed browser
uploads to the bucket. The bucket and its objects are retained if the image stack is
removed. Existing images are not migrated or served by SuperAlliance; records that
reference the previous image host will stop displaying images when that old
hosting is removed.

The deploy creates the SuperAlliance DNS aliases and validates the SuperAlliance site and
image host certificate through Route 53. The previous SuperAlliance site, API,
and image resources are not managed or updated by this repository and may
remain active until manually removed.
SuperAlliance uses the same MongoDB database as the previous app, so deleting the
SuperAlliance stacks rolls back its infrastructure but does not undo data written by
SuperAlliance. The SuperAlliance frontend bucket and Lambda log group are configured for
deletion with their stacks.

Useful commands from the repository root:

```bash
npm run cdk:build
npm run cdk:test
npm run cdk:synth
npm run cdk:diff
npm run cdk:deploy
```

`cdk:deploy` requires the four backend CloudFormation parameters, which the
GitHub workflow supplies from repository secrets.

## Local Setup
1. Clone the repo to your machine using either HTTPS or SSH:
    * HTTPS: `git clone https://github.com/STMARobotics/superalliance.git` 
    * SSH: `git clone git@github.com:STMARobotics/superalliance.git`

2. Install dependencies for all packages (run from the root directory):
    * `npm install`

3. Set up environment variables for the frontend:
    * Create a file named `app/.env.local` and put the following configuration values in it:
        ```
        VITE_CLERK_PUBLISHABLE_KEY=<get_value_from_admin>
        VITE_API_URL=http://localhost:3000
        ```

4. Set up environment variables for the backend API:
    * Create a file named `api/.env` and put the following configuration values in it:
        ```
        TBA_KEY=<get_value_from_admin>
        MONGODB_URI=<get_value_from_admin>
        CLERK_PUBLISHABLE_KEY=<get_value_from_admin>
        CLERK_SECRET_KEY=<get_value_from_admin>
        ROBOT_IMAGE_DISTRO=superalliance-images.7028robotics.com
        AWS_REGION=us-east-2
        ROBOT_IMAGE_BUCKET=superalliance-robot-images
        ```
    * In order to upload pit forms with images and run AI Scouting with AWS Bedrock:
      1) Log in to the [AWS access portal](https://d-9067879019.awsapps.com/start) with your stmarobotics.org Google account
      2) Choose _Access keys_
      3) Configure your access keys with an environment variable or credentials file
      4) Ensure your local AWS principal has `s3:PutObject` permission on the configured image bucket; the CDK grant applies to the deployed Lambda role, not local credentials

5. Start the development servers:

    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173`
    The API will be available at `http://localhost:3000`

    💡 TIP: In VS Code, you can use the [JavaScript Debug Terminal](https://code.visualstudio.com/docs/nodejs/nodejs-debugging) to run the API so you can set breakpoints and debug. 
