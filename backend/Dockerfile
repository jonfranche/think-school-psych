FROM golang:1.23-alpine

WORKDIR /usr/src/app

COPY ./backend/go.mod ./backend/go.sum ./

RUN go mod download && go mod verify

COPY ./backend .

COPY ./env/postgres_prod.env /usr/src/env/postgres_prod.env

COPY ./env/service-account_prod.json /usr/src/env/service-account_prod.json

RUN go build -v -o /usr/local/bin/app 

EXPOSE 8010

CMD ["app"]