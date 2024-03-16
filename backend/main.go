package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

var (
	dbName string
	dbHost string
	dbPort string
	dbUser string
	dbPassword string
)

func init() {
	err := godotenv.Load("../env/postgres.env")
	if err != nil {
		log.Fatal(".env file couldn't be loaded")
	}

	dbName = os.Getenv("POSTGRES_DB")
	dbHost = os.Getenv("DB_HOST")
	dbPort = os.Getenv("DB_PORT")
	dbUser = os.Getenv("POSTGRES_USER")
	dbPassword = os.Getenv("POSTGRES_PASSWORD")
}

func main() {
	a := App {}
	a.Initialize(dbUser, dbPassword, dbPort, dbHost, dbName)

	// TODO: enable CORS

	a.Run(":8010")
}
