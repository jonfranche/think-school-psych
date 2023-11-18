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

type message struct {
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
	fmt.Println(users)
	fmt.Println(comments)
	r := gin.Default()
	r.GET("/api/stories", getStories)
	r.POST("/api/stories/new", postStory)
	r.PATCH("/api/stories/edit/:id", updateStory)
	r.DELETE("/api/stories/edit/:id", deleteStory)
	r.GET("/api/stories/:id", getStoryByID)
	r.GET("/api/comments/:id", getCommentByID)
	r.POST("/api/comments/", postComment)
	r.PATCH("/api/comments/:id", updateComment)
	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}

func IDNotFound(c *gin.Context, dataType string) {
	var newError message
	newError.Message = fmt.Sprintf("Could not find %v with ID: %v", dataType, c.Params.ByName("id"))
	c.JSON(http.StatusNotFound, newError)
}

func successMessage(c *gin.Context, msg string) {
	var newMsg message
	newMsg.Message = msg
	c.JSON(http.StatusOK, newMsg)
}

func getStories(c *gin.Context) {
	c.JSON(http.StatusOK, stories)
}

func postStory(c *gin.Context) {
	// TODO: add authorization
	var newStory story

	if err := c.BindJSON(&newStory); err != nil {
		var newError message
		newError.Message = "Something went wrong. Could not post your story."
		c.JSON(http.StatusInternalServerError, newError)
		return
	}

	newStory.Date = time.Now()
	newStory.ID = uuid.NewString()
	newStory.CommentIDs = []string{}
	fmt.Println(newStory)
	stories = append(stories, newStory)
	c.JSON(http.StatusCreated, newStory)
}

func updateStory(c *gin.Context) {
	// TODO: Add Authentication
	for idx, val := range stories {
		if val.ID == c.Params.ByName("id") {
			if err := c.BindJSON(&val); err != nil {
				var newError message
				newError.Message = "Something went wrong. Could not post your story."
				c.JSON(http.StatusInternalServerError, newError)
				return
			}

			stories[idx] = val
			c.JSON(http.StatusOK, val)
			return
		}
	}

	IDNotFound(c, "story")
}

func deleteStory(c *gin.Context) {
	// TODO: Add Authetication
	for idx, val := range stories {
		if val.ID == c.Params.ByName("id") {
			if idx == 0 {
				stories = stories[1:]
				successMessage(c, "Successfully deleted story")
				return
			}
			if idx != len(stories)-1 {
				newSlice := make([]story, 0)
				newSlice = append(newSlice, stories[:idx]...)
				stories = append(newSlice, stories[idx+1:]...)
				successMessage(c, "Successfully deleted story")
				return
			}
			if idx == len(stories)-1 {
				stories = stories[:idx]
				successMessage(c, "Successfully deleted story")
				return
			}
		}
	}

	IDNotFound(c, "story")
}

func getStoryByID(c *gin.Context) {
	// TODO: add comments to the return
	for _, val := range stories {
		if val.ID == c.Params.ByName("id") {
			c.JSON(http.StatusOK, val)
			return
		}
	}

	IDNotFound(c, "story")
}

func getCommentByID(c *gin.Context) {
	for _, val := range comments {
		if val.ID == c.Params.ByName("id") {
			c.JSON(http.StatusOK, val)
			return
		}
	}

	IDNotFound(c, "comment")
}

func postComment(c *gin.Context) {
	// TODO: add authorization
	var newComment comment

	if err := c.BindJSON(&newComment); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"messsage": "Something went wrong. Could not post your comment."})
		return
	}

	newComment.Date = time.Now()
	newComment.ID = uuid.NewString()
	fmt.Println(newComment)
	comments = append(comments, newComment)

	// bind new comment to the story
	for idx, val := range stories {
		if val.ID == newComment.BlogID {
			val.CommentIDs = append(val.CommentIDs, newComment.ID)
			stories[idx] = val
			c.JSON(http.StatusCreated, newComment)
			return
		}
	}

	c.JSON(http.StatusInternalServerError, 
		gin.H{"messsage": "Something went wrong. Could not find the Story that you are commenting on."})
}

func updateComment(c *gin.Context) {
	// TODO: add authorization
	for idx, val := range comments {
		if val.ID == c.Params.ByName("id") {
			if err := c.BindJSON(&val); err != nil {
				c.JSON(http.StatusBadRequest, 
					gin.H{"message": "Something went wrong. Could not edit your comment"})
				return
			}
			comments[idx] = val
			c.JSON(http.StatusOK, val)
			return
		}
	}

	IDNotFound(c, "comment")
}
// TODO: create route for DELETE /stories/:id/comment?:id

// TODO: create route for POST /login

// TODO: create route for POST /signup

// TODO: create route for GET /user/:id

// TODO: create route for UPDATE /user/:id