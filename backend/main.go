package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type story struct {
	ID string `json:"id"`
	Title string `json:"title"`
	Date time.Time `json:"date"`
	UserID string `json:"userID"`
	Text string `json:"text"`
	CommentIDs []string `json:"commentIDs"`
}

type user struct {
	ID string `json:"id"`
	JoinDate time.Time `json:"joinDate"`
	Name string `json:"name"`
	Email string `json:"email"`
	Password string `json:"password"`
	IsAdmin bool `json:"isAdmin"`
}

type comment struct {
	ID string `json:"id"`
	Date time.Time `json:"date"`
	UserID string `json:"userID"`
	BlogID string `json:"blogID"`
	Text string `json:"text"`
}

type errorMessage struct {
	Message string `json:"message"`
}

var stories = []story {
	{
		ID: "1", 
		Date: time.Date(2022, 6, 12, 0, 0, 0, 0, time.Local), 
		UserID: "1", 
		CommentIDs: []string{"1", "2", "3"}, 
		Title: "Lorem Ipsum Dolor", 
		Text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
	},
	{
		ID: "2", 
		Date: time.Date(2022, 11, 3, 0, 0, 0, 0, time.Local), 
		UserID: "1", 
		CommentIDs: []string{"4", "5"}, 
		Title: "Dummy Blog Title", 
		Text: "This is placeholder text to test the blog functionality. This blog was made by user 1. It has 2 comments.",
	},
}

var users = []user {
	{
		ID: "1", 
		JoinDate: time.Date(2022, 6, 11, 0, 0, 0, 0, time.Local), 
		Name: "fakeuser1",
		Email: "fakeuser1@test.com",
		Password: "password123",
		IsAdmin: true,
	},
	{
		ID: "2",
		JoinDate: time.Date(2022, 7, 20, 0, 0, 0, 0, time.Local),
		Name: "testuser2",
		Email: "testuser2@test.com",
		Password: "password123",
		IsAdmin: false,
	},
}

var comments = []comment {
	{
		ID: "1",
		Date: time.Date(2022, 7, 20, 0, 0, 0, 0, time.Local),
		UserID: "2",
		BlogID: "1",
		Text: "Wow great post!",
	  },
	  {
		ID: "2",
		Date: time.Date(2022, 7, 21, 0, 0, 0, 0, time.Local),
		UserID: "1",
		BlogID: "1",
		Text: "Thanks, testuser2!",
	  },
	  {
		ID: "3",
		Date: time.Date(2022, 7, 21, 0, 0, 0, 0, time.Local),
		UserID: "2",
		BlogID: "1",
		Text: "You're welcome!",
	  },
	  {
		ID: "4",
		Date: time.Date(2022, 11, 3, 0, 0, 0, 0, time.Local),
		UserID: "2",
		BlogID: "2",
		Text: "Another well written blog, fakeuser1.",
	  },
	  {
		ID: "5",
		Date: time.Date(2022, 11, 4, 0, 0, 0, 0, time.Local),
		UserID: "1",
		BlogID: "2",
		Text: "Thanks so much, testuser2!",
	  },
}

func main() {
	fmt.Println("Hello World")
	fmt.Println(users)
	fmt.Println(comments)
	r := gin.Default()
	r.GET("/api/stories", getStories)
	r.POST("/api/stories/new", postStory)
	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}

func getStories(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, stories)
}

func postStory(c *gin.Context) {
	var newStory story

	if err := c.BindJSON(&newStory); err != nil {
		var newError errorMessage
		newError.Message = "Something went wrong. Could not post your story."
		c.IndentedJSON(http.StatusBadRequest, newError)
		return
	}

	newStory.Date = time.Now()
	newStory.ID = uuid.NewString()
	newStory.CommentIDs = []string{}
	fmt.Println(newStory)
	stories = append(stories, newStory)
	c.IndentedJSON(http.StatusCreated, newStory)
}

// TODO: create route for UPDATE /stories/edit/:id

func updateStory(c *gin.Context) {
	// use for loop to update the story whose ID matches the Param
	c.Params.ByName("id")
	for _, val := range stories {
		if val.ID == c.Params.ByName("id") {
			
		}
	}
}

// TODO: create route for DELETE /stories/edit/:id

// TODO: create route for GET /stories/:id

// TODO: create route for POST /stories/:id to create a new Comment

// TODO: create route for UPDATE /stories/:id/comment?:id

// TODO: create route for DELETE /stories/:id/comment?:id

// TODO: create route for POST /login

// TODO: create route for POST /signup

// TODO: create route for GET /user/:id

// TODO: create route for UPDATE /user/:id