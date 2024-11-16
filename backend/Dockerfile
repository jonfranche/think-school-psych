FROM golang:1.22.5-alpine

WORKDIR /usr/src/app

COPY ./backend/go.mod ./backend/go.sum ./

RUN go mod download && go mod verify

COPY ./backend .

COPY ./env/postgres_dev.env /usr/src/env/postgres_dev.env

COPY ./env/service-account_dev.json /usr/src/env/service-account_dev.json

RUN mkdir /usr/local/bin/app

RUN go build -v -o /usr/local/bin/app ./...

EXPOSE 8010

CMD ["app"]