# Scouting App 2025
Here at robotics, scouting is a very important intelligence operation which offers a significant edge when competing. The 2025 Scouting App does exactly this, employing our team members to analyze and take note of robots during matches. In doing so, they collectively gather and construct an extensive repository of robot strategies & approaches. The application allows those members to record that data but also reference and index such data to make decisions about team alliances, individual match strategies, consider successful practices other robots are implementing, and more. 

## Overview
The SuperAlliance is a cloud-based application deployed to AWS that is made up of a [React](https://react.dev/) frontend, [Node.js](https://nodejs.org/) API, and [MongoDB](https://www.mongodb.com/) database. Users interact with the React frontend application, the frontend calls the API to send/recieve data, and the API interacts with the database to read/update data. The frontend is deployed to [Amazon S3](https://aws.amazon.com/s3/) as a static website served by [AWS CloudFront](https://aws.amazon.com/cloudfront/) CDN. The API is deployed to [AWS Lambda](https://aws.amazon.com/lambda/) and is exposed using [AWS API Gateway](https://aws.amazon.com/api-gateway/).The database runs on [MongoDB Atlas](https://www.mongodb.com/) cloud platform.

## Build and Deployment
We have an automated process that uses [GitHub actions](https://github.com/features/actions) to deploy both the UI and the API to our Production environment in AWS. At a high level, GitHub actions starts a virtual machine that runs scripts to build and deploy the applications. The following sections outline the application-specific build and deployment details.

### Frontend UI
The workflow for deploying the UI is defined in `superalliance-ui-workflow.yml` and is currently configured to automatically deploy the application when changes are pushed to the `main` branch of the `/app` directory in the [superalliance repository](https://github.com/STMARobotics/superalliance). The build process compiles the application into static website assets and copies them to an [Amazon S3](https://aws.amazon.com/s3/) bucket named `super-alliance-ui`. We use [AWS CloudFront](https://aws.amazon.com/cloudfront/) to serve the assets from the S3 bucket. The process of copying the website assets to S3 is handled by a GitHub action called [s3-deploy](https://github.com/Reggionick/s3-deploy), this action also invalidated the CloudFront cache. For more details about how the build and deployment process works, see the `superalliance-ui-workflow.yml` file.

### Backend API
The workflow for deploying the API is defined in `superalliance-api-workflow.yml` and is currently configured to automatically deploy the application when changes are pushed to the `main` branch of the `/api` directory in the [superalliance repository](https://github.com/STMARobotics/superalliance). The build process uses a library called [Claudia.js](https://claudiajs.com/) to package and deploy the application as an [AWS Lambda](https://aws.amazon.com/lambda/) function and expose it using [AWS API Gateway](https://aws.amazon.com/api-gateway/). The Claudia library creates the required Lambda, associated AWS IAM Role, and API Gateway. Note that the build and deployment process runs [claudia update](https://github.com/claudiajs/claudia/blob/master/docs/update.md) to update the *existing* Lambda function that runs the API. If that Lambda (or the IAM Role or API Gateway) is ever deleted, you need to run [claudia create](https://github.com/claudiajs/claudia/blob/master/docs/create.md) to re-create the Lambda, Role & API Gateway. For more details about how the build and deployment process works, see the `superalliance-api-workflow.yml` file.

## Local Setup
1. Clone the repo to your machine using either HTTPS or SSH:
    * HTTPS: `git clone https://github.com/STMARobotics/superalliance.git` 
    * SSH: `git clone git@github.com:STMARobotics/superalliance.git`

2. Set up the frontend application
    * Open a command prompt and navigate to the `app` directory, then run the following commands:
        * `npm update`
        * `npm install`
    * Create a file named `.env.local` and put the following configuration values in it:
        * VITE_CLERK_PUBLISHABLE_KEY=<get_value_from_admin>
        * CLERK_SECRET_KEY=<get_value_from_admin>
        * VITE_API_URL=<get_value_from_admin>
    * `npm run dev` to start the application

3. Set up the API application
    * Open a command prompt and navigate to the `api` directory, then run the following commands:
        * `npm update`
        * `npm install`
        * `npm install -g nodemon`
    * Create a file named `.env` and put the following configuration values in it:
        * TBA_KEY=<get_value_from_admin>
        * MONGODB_URI=<get_value_from_admin>
        * CLERK_PUBLISHABLE_KEY=<get_value_from_admin>
        * CLERK_SECRET_KEY=<get_value_from_admin>
        * ROBOT_IMAGE_DISTRO=robot-images.stmarobotics.org
        * AWS_REGION=us-east-2
    * In order to upload pit forms with images:
      1) log in to the [AWS access portal](https://d-9067879019.awsapps.com/start) with your stmarobotics.org Google account
      2) Choose _Access keys_
      3) Configure your access keys with an environment variable or credentials file
    * `npm run dev` to start the application

## Helper Scripts 

### `/pre-init.sh`
This script initializes a laptop for development by ensuring that npm & node.js is installed, installs neccessary packages for`api` & `app`, and builds the client application. 
