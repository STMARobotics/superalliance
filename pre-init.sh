# Download and install fnm:
winget install Schniz.fnm

# Download and install Node.js:
fnm install 22

# Verify the Node.js version:
node -v # Should print "v22.13.1".

# Verify npm version:
npm -v # Should print "10.9.2".

npm install -g nodemon

cd /api 

npm update 

cd ../app

npm run update 
npm run build
