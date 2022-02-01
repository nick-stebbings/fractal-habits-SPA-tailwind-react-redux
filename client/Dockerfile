FROM node:lts-alpine
WORKDIR /usr/src/app
COPY package.json ./
RUN apk add --update nodejs npm
RUN npm install --legacy-peer-deps  
COPY . .
CMD ["NODE_ENV=production", "npm", "run", "build"]
CMD ["apk", "update"]
CMD ["apk", "add", "nano"]
CMD ["node", "server.js"]