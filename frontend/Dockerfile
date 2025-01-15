FROM node:current-alpine

WORKDIR /frontend

COPY package.json .

RUN npm install --verbose

COPY . .

RUN npm run build

COPY .env.local ./frontend/build