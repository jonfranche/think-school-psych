FROM node:lts-alpine

WORKDIR /frontend

COPY package.json .

RUN npm install --verbose

COPY . .

RUN npm run build

COPY ./src/.env.local ./frontend/build