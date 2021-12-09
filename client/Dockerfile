FROM node:lts-alpine
WORKDIR /usr/src/app
COPY package.json ./
RUN apk add --update nodejs npm
RUN npm install
COPY . .
CMD ["NODE_ENV=production", "npm", "run", "build"]
CMD ["node", "server.js"]