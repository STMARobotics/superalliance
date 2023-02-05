FROM node:latest

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm i

COPY ./ ./

RUN npm install -g serve

RUN npm run build

CMD ["serve", "-s", "build"]