FROM node:22-alpine

WORKDIR /app  

COPY package*.json ./  

RUN npm ci  

COPY . .  

RUN npm run build  

ENV CLIENT_PORT 3000

CMD ["npm", "run", "dockerStart"]