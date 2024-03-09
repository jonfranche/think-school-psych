package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"encoding/json"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

type App struct {
	Router *mux.Router
	DB *sql.DB
}

func(a *App) Initialize(user, password, port, host, dbname string) {
	connectionString :=
		fmt.Sprintf("user=%s password=%s port=%s host=%s dbname=%s sslmode=disable", user, password, port, host, dbname)

	var err error

	a.DB, err = sql.Open("postgres", connectionString)
	if err != nil {
		log.Fatal(err)
	}

	a.Router = mux.NewRouter()
	a.initializeRoutes()
}

func (a *App) Run(addr string) {
	log.Fatal(http.ListenAndServe(":8010", a.Router))
}

func (a *App) getStory(w http.ResponseWriter, r *http.Request) {
	// extract the id from the URL
	vars := mux.Vars(r)
	// convert url param to a string and assign it to "id"
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid story ID")
	}

	// call the getStory method in models to retrieve the row in the products
	// table that matches the id in the URL
	s := story{ID: id}
	if err := s.getProduct(a.DB); err != nil {
		switch err {
		case sql.ErrNoRows:
			respondWithError(w, http.StatusNotFound, "Story not found")
		default:
			respondWithError(w, http.StatusInternalServerError, err.Error())
		}
		return
	}

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

	// call the createProduct method in models to insert the data into database
	if err := s.updateProduct(a.DB); err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	// send a response that creation operation was successful
	respondWithJSON(w, http.StatusOK, s)
}

func (a *App) initializeRoutes() {
	// Set up Server
	// r := gin.Default()
	// r.GET("/api/stories", controllers.GetStories)
	// r.POST("/api/stories/new", controllers.PostStory)
	// r.PATCH("/api/stories/edit/:id", controllers.UpdateStory)
	// r.DELETE("/api/stories/edit/:id", controllers.DeleteStory)
	// r.GET("/api/stories/:id", controllers.GetStoryByID)
	// r.GET("/api/comments/:id", controllers.GetCommentByID)
	// r.POST("/api/comments/", controllers.PostComment)
	// r.PATCH("/api/comments/:id", controllers.UpdateComment)
	// r.DELETE("/api/comments/:id", controllers.DeleteComment)
	// r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
	a.Router.HandleFunc("/api/stories", a.getStories).Methods("GET")
	a.Router.HandleFunc("/api/stories/new", a.createStory).Methods("POST")
	a.Router.HandleFunc("/api/stories/{id:[0-9]+}", a.getStories).Methods("GET")
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



