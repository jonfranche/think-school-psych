package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

type App struct {
	Router *mux.Router
	DB *sql.DB
}

func(a *App) Initialize(user, password, port, host, dbname string) {
	fmt.Println("Initializing Server on port: " + port + "...")
	connectionString :=
		fmt.Sprintf("user=%s password=%s port=%s host=%s dbname=%s sslmode=disable", user, password, port, host, dbname)

	var err error

	a.DB, err = sql.Open("postgres", connectionString)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to database")
	a.Router = mux.NewRouter()
	a.initializeRoutes()
	fmt.Println("Initialization successful!")
}

func (a *App) Run(addr string) {
	log.Fatal(http.ListenAndServe(":8010", a.Router))
}

func (a *App) getStory(w http.ResponseWriter, r *http.Request) {
	// extract the id from the URL
	vars := mux.Vars(r)
	// convert url param to a string and assign it to "id"
	// TODO: Uncomment following statement and find out why nil is causing an error
	// id, err := vars["id"]
	// if err != nil {
	// 	respondWithError(w, http.StatusBadRequest, "Invalid story ID")
	// }

	id := vars["id"]

	// call the getStory method in models to retrieve the row in the products
	// table that matches the id in the URL
	s := story{ID: id}
	if err := s.getStory(a.DB); err != nil {
		switch err {
		case sql.ErrNoRows:
			respondWithError(w, http.StatusNotFound, "Story not found")
		default:
			respondWithError(w, http.StatusInternalServerError, err.Error())
		}
		return
	}

	// convert the stored userID from pk to uuid
	s.getUserUUIDByID(a.DB)
	// send a response that creation operation was successful
	respondWithJSON(w, http.StatusOK, s)
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
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondWithJSON(w, http.StatusOK, stories)
}

func (a *App) getUsers(w http.ResponseWriter, r *http.Request) {
	users, err := getUsers(a.DB)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondWithJSON(w, http.StatusOK, users)
}

func (a *App) createStory(w http.ResponseWriter, r *http.Request) {
	// convert the JSON data recceived fro the request to a story struct
	var s story
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&s); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}
	// the defer keyword executes subsequent statement once the method is complete
	defer r.Body.Close()

	s.Date = time.Now()

	// call the createProduct method in models to insert the data into database
	if err := s.createStory(a.DB); err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	// send a response that creation operation was successful
	respondWithJSON(w, http.StatusOK, s)
}

func (a *App) createUser(w http.ResponseWriter, r *http.Request) {
	var u user
	
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&u); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	defer r.Body.Close()

	u.JoinDate = time.Now()

	if err := u.createUser(a.DB); err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondWithJSON(w, http.StatusOK, u)
}

func (a *App) updateStory(w http.ResponseWriter, r *http.Request) {
	// extract the id from the URL
	vars := mux.Vars(r)
	// TODO: Uncomment following statement and find out why nil is causing an error
	// id, err := vars["id"]
	// if err != nil {
	// 	respondWithError(w, http.StatusBadRequest, "Invalid story ID")
	// }

	id := vars["id"]

	// convert the JSON data received from the request to a story struct
	var s story
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&s); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	defer r.Body.Close()
	s.ID = id

	// call the updateStory in models to make changes to the row in story
	// table that matches the id from the URL
	if err := s.updateStory(a.DB); err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	// send a response that creation operation was successful
	respondWithJSON(w, http.StatusOK, s)
}

func (a *App) deleteStory(w http.ResponseWriter, r *http.Request) {
	// extract the id from the URL
	vars := mux.Vars(r)
	// TODO: Uncomment following statement and find out why nil is causing an error
	// id, err := vars["id"]
	// if err != nil {
	// 	respondWithError(w, http.StatusBadRequest, "Invalid story ID")
	// }

	id := vars["id"]

	// call the deleteStory method in models to delete the row in the story
	// table that matches the id from the URL
	s := story{ID: id}
	if err := s.deleteStory(a.DB); err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	// send a response that creation operation was successful
	respondWithJSON(w, http.StatusOK, map[string]string{"result": "success"})
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

func respondWithError(w http.ResponseWriter, code int, message string) {
	respondWithJSON(w, code, map[string]string{"error": message})
}

func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}



