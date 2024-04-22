package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	firebase "firebase.google.com/go/v4"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
	"google.golang.org/api/option"
)

type App struct {
	Router *mux.Router
	DB     *sql.DB
	FB     *firebase.App
}

func (a *App) Initialize(user, password, port, host, dbname string) {
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

	// import firebase service account
	opt := option.WithCredentialsFile("../env/service-account.json")

	// create new firebase instance
	fb, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		log.Fatalf("error initializing firebase: %v\n", err)
	}

	a.FB = fb
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
	if !validateUUID(id, w) {
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
	var u user
	var s story

	// extract the id from the URL
	u.ID = mux.Vars(r)["userId"]

	// convert the JSON data recceived fro the request to a story struct
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&s); err != nil {
		log.Printf("HTTP Status: %d. Error occurred when creating story", 400)
		respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}
	// the defer keyword executes subsequent statement once the method is complete
	defer r.Body.Close()

	u.getUserIdByUid(a.DB)

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
		log.Print(err.Error())
		return
	}

	defer r.Body.Close()
	u.JoinDate = time.Now()

	// pwStr := []byte(u.Password)

	// pw, err := bcrypt.GenerateFromPassword(pwStr, 12)
	// if err != nil {
	// 	log.Printf("HTTP Status: %d. Error encrypting password", 500)
	// 	respondWithError(w, http.StatusInternalServerError, err.Error())
	// }

	// u.Password = string(pw)

	if err := u.createUser(a.DB); err != nil {
		log.Printf("HTTP Status: %d. Error occurred when creating user", 500)
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	// create jwt
	// token, err := assignToken(u.ID, a)
	// if err != nil {
	// 	log.Printf("HTTP Status: %d. Error assigning JWT", 500)
	// 	respondWithError(w, http.StatusInternalServerError, err.Error())
	// }

	payload := map[string]string{"id": u.ID, "email": u.Email}
	respondWithJSON(w, http.StatusOK, payload)
	log.Printf("HTTP Status: %d. Successfully created user with email: %s. ID assigned: %s", 201, u.Email, u.ID)
}

// func (a *App) loginUser(w http.ResponseWriter, r *http.Request) {
// 	var u user

// 	decoder := json.NewDecoder(r.Body)
// 	if err := decoder.Decode(&u); err != nil {
// 		log.Printf("Http Status: %d. Error logging in user with invalid request payload", 400)
// 		respondWithError(w, http.StatusBadRequest, "Invalid request payload")
// 		return
// 	}

// 	defer r.Body.Close()

// 	// find user in db
// 	var existingUser user;
// 	existingUser.Email = u.Email
// 	if err := existingUser.getUserPasswordByEmail(a.DB); err != nil {
// 		switch err {
// 		case sql.ErrNoRows:
// 			log.Printf("HTTP Status: %d. Invalid email, could not log user in.", 404)
// 			respondWithError(w, http.StatusNotFound, "User not found")
// 		default:
// 			log.Printf("HTTP Status: %d. Error occurred when retrieving user", 500)
// 			respondWithError(w, http.StatusInternalServerError, err.Error())
// 		}
// 		return
// 	}

// 	// compare password with hashed password
// 	if err := bcrypt.CompareHashAndPassword([]byte(existingUser.Password), []byte(u.Password)); err != nil {
// 		log.Printf("HTTP Status: %d. Invalid password, could not log user in.", 403)
// 		respondWithError(w, http.StatusForbidden, "Invalid credentials, could not log you in.")
// 		return
// 	}

// 	// create new token
// 	token, err := assignToken(existingUser.ID, a);
// 	if err != nil {
// 		log.Printf("HTTP Status: %d. Error assigning JWT", 500)
// 		respondWithError(w, http.StatusInternalServerError, err.Error())
// 	}

// 	// respond with json of uid, email, token
// 	payload := map[string]string{"id": existingUser.ID, "email": existingUser.Email, "token": token}
// 	respondWithJSON(w, http.StatusOK, payload)
// 	log.Printf("HTTP Status: %d User has signed in.\nEmail: %s, ID: %s", 200, existingUser.Email, existingUser.ID)
// }

func (a *App) updateStory(w http.ResponseWriter, r *http.Request) {
	// extract the id from the URL
	vars := mux.Vars(r)
	id := vars["id"]

	// validate that id is a uuid
	if !validateUUID(id, w) {
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

	// TODO: add authorization

	// validate that id is a uuid
	if !validateUUID(id, w) {
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

func (a *App) createComment(w http.ResponseWriter, r *http.Request) {
	var c comment
	// get story id from url
	vars := mux.Vars(r)
	storyId := vars["id"]

	// validate that id is a uuid
	if !validateUUID(storyId, w) {
		return
	}

	// extract userID and text from json
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&c); err != nil {
		log.Printf("HTTP Status: %d. Error occurred when creating comment", 400)
		respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	defer r.Body.Close()

	c.StoryID = storyId
	c.ID = uuid.NewString()
	c.Date = time.Now()

	// call createComment method in models to insert the data into db
	if err := c.createComment(a.DB); err != nil {
		log.Printf("HTTP Status: %d. Error creating comment", 500)
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	// send response that creation operation was successful
	respondWithJSON(w, http.StatusCreated, c.ID)
	log.Printf("HTTP Status: %d. Successfully created comment", 201)
}

func (a *App) getComments(w http.ResponseWriter, r *http.Request) {
	storyId := mux.Vars(r)["id"]

	comments, err := getCommentsByStoryId(a.DB, storyId)
	if err != nil {
		log.Printf("HTTP State: %d. Error occurred when retrieving comments", 500)
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondWithJSON(w, http.StatusOK, comments)
	log.Printf("HTTP Status: %d. Successfully retrieved comments", 200)
}

func (a *App) updateComment(w http.ResponseWriter, r *http.Request) {
	var c comment
	commentId := mux.Vars(r)["id"]

	if !validateUUID(commentId, w) {
		return
	}

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&c); err != nil {
		log.Printf("HTTP Status: %d. Error when updating comment", 400)
		respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	c.ID = commentId
	defer r.Body.Close()

	if err := c.updateCommentById(a.DB); err != nil {
		log.Printf("HTTP Status: %d. Error updating comment", 500)
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	// TODO: improve response JSON so that it sends actual result
	respondWithJSON(w, http.StatusOK, map[string]string{"result": "Comment Update Successful"})
	log.Printf("HTTP Status: %d. Successfully updated comment with ID: %s", 200, c.ID)
}

func (a *App) initializeRoutes() {
	a.Router.HandleFunc("/api/signup", a.createUser).Methods("POST")
	// a.Router.HandleFunc("/api/login", a.loginUser).Methods("POST")
	a.Router.HandleFunc("/api/stories/{id}", a.getStory).Methods("GET")
	a.Router.HandleFunc("/api/stories", a.getStories).Methods("GET")
	a.Router.HandleFunc("/api/stories/{id}/comments", a.getComments).Methods("GET")

	privateRouter := a.Router.PathPrefix("/").Subrouter()

	privateRouter.Use(a.authMiddleware)

	privateRouter.HandleFunc("/api/stories/{id}/comment", a.createComment).Methods("POST")
	privateRouter.HandleFunc("/api/stories/new/{userId}", a.createStory).Methods("POST")
	privateRouter.HandleFunc("/api/stories/{id}", a.updateStory).Methods("PATCH")
	privateRouter.HandleFunc("/api/stories/{id}", a.deleteStory).Methods("DELETE")
	privateRouter.HandleFunc("/api/stories/comment/{id}", a.updateComment).Methods("PATCH")
	privateRouter.HandleFunc("/api/users", a.getUsers).Methods("GET")
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

func (a *App) authMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenString := r.Header.Get("Authorization")
		if tokenString == "" {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		tokenString = strings.Replace(tokenString, "Bearer ", "", 1)

		decodedToken, err := verifyToken(tokenString, a)
		if err != nil {
			respondWithError(w, http.StatusForbidden, "Token is invalid")
			return
		}

		ctx := context.WithValue(r.Context(), "uid", decodedToken)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// Verify the firebase token that is received in header from frontend
func verifyToken(tokenId string, a *App) (string, error) {
	client, err := a.FB.Auth(context.Background())
	if err != nil {
		log.Printf("error getting Auth client %v\n", err)
		return "", err
	}

	token, err := client.VerifyIDTokenAndCheckRevoked(context.Background(), tokenId)
	if err != nil {
		log.Printf("error verifying ID %v\n", err)
		return "", err
	}

	// return decoded uid
	return token.UID, nil
}
