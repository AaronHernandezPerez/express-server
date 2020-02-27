FROM node:12

WORKDIR /usr/src/express_app

copy . .

RUN npm i

EXPOSE 5000