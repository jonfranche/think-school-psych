package main_test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"strconv"
	"testing"
	"time"

	"github.com/google/uuid"
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

func TestMain(m *testing.M) {
	a.Initialize(dbUser, dbPassword, dbPort, dbHost, dbName)

	ensureTableExists()
	code := m.Run()
	clearTable()
	os.Exit(code)
}

func TestEmptyTable(t *testing.T) {
	clearTable()

	req, _ := http.NewRequest("GET", "/api/stories", nil)
	response := executeRequest(req)

	checkResponseCode(t, http.StatusOK, response.Code)

	if body := response.Body.String(); body != "[]" {
		t.Errorf("Expected an empty array. Got %s", body)
	}
}

func TestGetNonExistentStory(t *testing.T) {
	clearTable()

	id, err := uuid.NewRandom()
	if err != nil {
		log.Fatal("An error occurred when creating a UUID")
	}

	route := fmt.Sprintf("/api/stories/%s", id)
	req, _ := http.NewRequest("GET", route, nil)
	response := executeRequest(req)

	var m map[string]string
	json.Unmarshal(response.Body.Bytes(), &m)
	if m["error"] != "Story not found" {
		t.Errorf("Expected the 'error' key of the response to be set to 'Story not found'. Got '%s'", m["error"])
	}
}

func TestCreateStory(t *testing.T) {
	clearTable()

	var jsonStr = []byte(`{"title":"test title", "text":"This is a test paragraph to see if TestCreateStory functions as intended"}`)
	req, _ := http.NewRequest("POST", "/api/stories/new", bytes.NewBuffer(jsonStr))
	req.Header.Set("Content-Type", "application/json")

	response := executeRequest(req)
	checkResponseCode(t, http.StatusCreated, response.Code)

	var m map[string]interface{}

	json.Unmarshal(response.Body.Bytes(), &m)

	if m["title"] != "test title" {
		t.Errorf("Expected story title to be 'test title'. Got '%v'", m["title"])
	}

	if m["text"] != "This is a test paragraph to see if TestCreateStory functions as intended" {
		t.Errorf("Expected story text to be 'This is a test paragraph to see if TestCreateStory functions as intended'. Got '%v'",
			m["text"])
	}
}

func TestGetStory(t *testing.T) {
	clearTable()
	addStories(1)

	req, _ := http.NewRequest("GET", "/stories/dbbb8f81-a981-4a2f-aa24-9566b2de637f", nil)
	response := executeRequest(req)

	checkResponseCode(t, http.StatusOK, response.Code)
}

func ensureTableExists() {
	if _, err := a.DB.Exec(tableCreationQuery); err != nil {
		log.Fatal(err)
	}
}

func clearTable() {
	a.DB.Exec("DELETE FROM stories")
	a.DB.Exec("ALTER SEQUENCE stories_pk_seq RESTART WITH 1")
}

func addStories(count int) {
	if count < 1 {
		count = 1
	}

	for i := 0; i < count; i++ {
		d := time.Now()

		a.DB.Exec("INSERT INTO stories(title, date, userid, text) VALUES($1, $2, $3, $4)", "Story "+strconv.Itoa(i),
			d, 1, "Test Text for Story "+strconv.Itoa(i))

		p := i + 1
		if i == 0 {
			id, _ := uuid.Parse("dbbb8f81-a981-4a2f-aa24-9566b2de637f")
			a.DB.Exec("UPDATE stories SET id = $1 WHERE pk = $2", id, p)
		}
	}
}

func executeRequest(req *http.Request) *httptest.ResponseRecorder {
	rr := httptest.NewRecorder()
	a.Router.ServeHTTP(rr, req)

	return rr
}

func checkResponseCode(t *testing.T, expected, actual int) {
	if expected != actual {
		t.Errorf("Expected response code %d. Got %d\n", expected, actual)
	}
}

const tableCreationQuery = `CREATE TABLE IF NOT EXISTS stories
(
	pk BIGSERIAL NOT NULL PRIMARY KEY,
	id uuid DEFAULT gen_random_uuid(),
	title VARCHAR(150) NOT NULL,
	date DATE NOT NULL,
	userid INT NOT NULL,
	text TEST NOT NULL
)`