FROM node:21-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

CMD ["node", "./dist/app.js"]