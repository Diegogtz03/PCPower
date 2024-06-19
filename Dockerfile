FROM node:18.17.0-alpine

WORKDIR /PCPower

COPY package*.json ./

RUN npm install --verbose

COPY . .

CMD ["sh", "-c", "npm start"]

EXPOSE 3009
EXPOSE 3100