package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
)

var (
	testUserID string
)

type App struct {
	Router *mux.Router
	DB *sql.DB
}

func init() {
	err := godotenv.Load("../env/backend.env")
	if err != nil {
		log.Fatal(".env file couldn't be loaded")
	}

	testUserID = os.Getenv("TEST_USER_ID")
}

func(a *App) Initialize(user, password, port, host, dbname string) {
	log.Println("Connecting Database on port: " + port + "...")
	connectionString :=
		fmt.Sprintf("user=%s password=%s port=%s host=%s dbname=%s sslmode=disable", user, password, port, host, dbname)

	var err error

	a.DB, err = sql.Open("postgres", connectionString)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Connected to database")
	a.Router = mux.NewRouter()
	a.initializeRoutes()
	log.Println("Initialization successful!")
}

func (a *App) Run(addr string) {
	handler := cors.Default().Handler(a.Router)
	log.Fatal(http.ListenAndServe(":8010", handler))
}

func (a *App) getStory(w http.ResponseWriter, r *http.Request) {
	// extract the id from the URL
	vars := mux.Vars(r)
	id := vars["id"]

	// validate that id is a uuid
	if (!validateUUID(id, w)) {
		return
	}

	// call the getStory method in models to retrieve the row in the products
	// table that matches the id in the URL
	s := story{ID: id}
	if err := s.getStory(a.DB); err != nil {
		switch err {
		case sql.ErrNoRows:
			log.Printf("HTTP Status: %d. Error occurred when retrieving story", 404)
			respondWithError(w, http.StatusNotFound, "Story not found")
		default:
			log.Printf("HTTP Status: %d. Error occurred when retrieving story", 500)
			respondWithError(w, http.StatusInternalServerError, err.Error())
		}
		return
	}

	// convert the stored userID from pk to uuid
	s.getUserUuidById(a.DB)
	// send a response that creation operation was successful
	respondWithJSON(w, http.StatusOK, s)
	log.Printf("HTTP Status: %d. Successfully retrieved story", 200)
}

func (a *App) getStories(w http.ResponseWriter, r *http.Request) {
	// This handler uses the count and start parameters from the querystring 
	// to fetch count number of products, starting at position start in the database.
	// By default, start is set to 0 and count is set to 10. If these parameters 
	// aren’t provided, this handler will respond with the first 10 products.

	count, _ := strconv.Atoi(r.FormValue("count"))
	start, _ := strconv.Atoi(r.FormValue("start"))

	if count > 10 || count < 1 {
		count = 10
	}
	if start < 0 {
		start = 0
	}

	stories, err := getStories(a.DB, start, count)
	if err != nil {
		log.Printf("HTTP Status: %d. Error occurred when retrieving story", 500)
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondWithJSON(w, http.StatusOK, stories)
	log.Printf("HTTP Status: %d. Successfully retrieved story", 200)
}

func (a *App) getUsers(w http.ResponseWriter, r *http.Request) {
	users, err := getUsers(a.DB)
	if err != nil {
		log.Printf("HTTP Status: %d. Error occurred when retrieving users", 500)
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondWithJSON(w, http.StatusOK, users)
	log.Printf("HTTP Status: %d. Successfully retrieved users", 200)
}

func (a *App) createStory(w http.ResponseWriter, r *http.Request) {
	// convert the JSON data recceived fro the request to a story struct
	var s story
	var u user
	// TODO: delete this once authentication is implemented
	u.ID = testUserID
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&s); err != nil {
		log.Printf("HTTP Status: %d. Error occurred when creating story", 400)
		respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}
	// the defer keyword executes subsequent statement once the method is complete
	defer r.Body.Close()

	u.getUserIdByUuid(a.DB)

	var id string = u.ID

	s.Date = time.Now()
	s.UserID = id

	// TODO: uncomment next line after uuid is implemented in backend
	// log.Println("Created Story with ID: " + s.ID)

	// call the createStory method in models to insert the data into database
	if err := s.createStory(a.DB); err != nil {
		log.Printf("HTTP Status: %d. Error creating story", 500)
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	// send a response that creation operation was successful
	respondWithJSON(w, http.StatusCreated, s)
	log.Printf("HTTP Status: %d. Successfully created story", 201)
}

func (a *App) createUser(w http.ResponseWriter, r *http.Request) {
	var u user
	
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&u); err != nil {
		log.Printf("HTTP Status: %d. Error creating user with invalid request payload", 400)
		respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	defer r.Body.Close()

	u.JoinDate = time.Now()

	if err := u.createUser(a.DB); err != nil {
		log.Printf("HTTP Status: %d. Error occurred when creating user", 500)
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	// TODO: uncomment next line after uuid is implemented in backend
	// log.Println("Created User with ID: " + u.ID)
	respondWithJSON(w, http.StatusOK, u)
	log.Printf("HTTP Status: %d. Successfully created user", 201)
}

func (a *App) updateStory(w http.ResponseWriter, r *http.Request) {
	// extract the id from the URL
	vars := mux.Vars(r)
	id := vars["id"]

	// validate that id is a uuid
	if (!validateUUID(id, w)) {
		return
	}

	// convert the JSON data received from the request to a story struct
	var s story
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&s); err != nil {
		log.Printf("HTTP Status: %d. Error updating story with invalid request payload", 400)
		respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	defer r.Body.Close()
	s.ID = id

	// call the updateStory in models to make changes to the row in story
	// table that matches the id from the URL
	if err := s.updateStory(a.DB); err != nil {
		log.Printf("HTTP Status: %d. Error occurred when updating story", 500)
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	// send a response that creation operation was successful
	respondWithJSON(w, http.StatusOK, s)
	log.Printf("HTTP Status: %d. Successfully updated story with ID: %s", 200, s.ID)
}

func (a *App) deleteStory(w http.ResponseWriter, r *http.Request) {
	// extract the id from the URL
	vars := mux.Vars(r)
	id := vars["id"]

	// validate that id is a uuid
	if (!validateUUID(id, w)) {
		return
	}

	// call the deleteStory method in models to delete the row in the story
	// table that matches the id from the URL
	s := story{ID: id}
	if err := s.deleteStory(a.DB); err != nil {
		log.Printf("HTTP Status: %d. Error occurred when deleting story", 500)
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	// send a response that creation operation was successful
	respondWithJSON(w, http.StatusOK, map[string]string{"result": "success"})
	log.Printf("HTTP Status: %d. Successfully deleted story with ID: %s", 20, s.ID)
}

func (a *App) initializeRoutes() {
	a.Router.HandleFunc("/api/signup", a.createUser).Methods("POST")
	a.Router.HandleFunc("/api/stories", a.getStories).Methods("GET")
	a.Router.HandleFunc("/api/stories/new", a.createStory).Methods("POST")
	a.Router.HandleFunc("/api/stories/{id}", a.getStory).Methods("GET")
	a.Router.HandleFunc("/api/stories/{id}", a.updateStory).Methods("PATCH")
	a.Router.HandleFunc("/api/stories/{id}", a.deleteStory).Methods("DELETE")
	a.Router.HandleFunc("/api/users", a.getUsers).Methods("GET")
}

func validateUUID(id string, w http.ResponseWriter) bool {
	_, err := uuid.Parse(id)
	if err != nil {
		log.Printf("HTTP Status: %d. Invalid ID of '%s' used.", 400, id)
		respondWithError(w, http.StatusBadRequest, "Invalid ID")
		return false
	}

	return true
}

func respondWithError(w http.ResponseWriter, code int, message string) {
	respondWithJSON(w, code, map[string]string{"error": message})
}

func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}

// TODO: create functions to write to console of any activity
