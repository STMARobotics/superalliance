# Scouting App 2025
Here at robotics, scouting is a very important intelligence operation which offers a significant edge when competing. The 2025 Scouting App does exactly this, employing our team members to analyze and take note of robots during matches. In doing so, they collectively gather and construct an extensive repository of robot strategies & approaches. The application allows those members to record that data but also reference and index such data to make decisions about team alliances, individual match strategies, consider successful practices other robots are implementing, and more. 

## Local Setup
1. Clone the repo to your machine using either HTTPS or SSH:
    HTTPS: `git clone https://github.com/STMARobotics/superalliance.git` 
    SSH: `git clone git@github.com:STMARobotics/superalliance.git`

2. Set up the frontend application
    * Open a command prompt and navigate to the `app` directory, then run the following commands:
        * `npm update`
        * `npm install`
    * Create a file named `env.local` and put the following configuration values in it:
        * VITE_CLERK_PUBLISHABLE_KEY=<get_value_from_admin>
        * CLERK_SECRET_KEY=<get_value_from_admin>
        * VITE_API_URL=<get_value_from_admin>
    * `npm run dev` to start the application

3. Set up the API application
    * Open a command prompt and navigate to the `api` directory, then run the following commands:
        * `npm update`
        * `npm install`
        * `npm install -g nodemon`
    * Create a file named `env.local` and put the following configuration values in it:
        * TBA_KEY=<get_value_from_admin>
        * MONGODB_URI=<get_value_from_admin>
        * API_URL="http://localhost:3000"
    * `npm run dev` to start the application

## Helper Scripts 

### `/pre-init.sh`
This script initializes a laptop for development by ensuring that npm & node.js is installed, installs neccessary packages for`api` & `app`, and builds the client application. 
