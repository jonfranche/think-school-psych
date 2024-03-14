package main_test

import (
	// "encoding/json"
	"log"
	"os"
	// "testing"
	// "strconv"
	// "bytes"
	// "net/http"
	// "net/http/httptest"

	"github.com/joho/godotenv"
	"github.com/jonfranche/thinkschoolpsych/backend"
)

var a main.App

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