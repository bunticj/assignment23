FROM node:18-alpine

WORKDIR /src/socket_server

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "start"]