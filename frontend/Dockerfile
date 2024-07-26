FROM node:lts-alpine

WORKDIR /frontend

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

COPY .env.local ./frontend/build