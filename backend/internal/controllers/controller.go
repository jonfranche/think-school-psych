package controllers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jonfranche/thinkschoolpsych/backend/internal/models"
)

var stories = models.Stories
var comments = models.Comments

type message struct {
	Message string `json:"message"`
}

func IDNotFound(c *gin.Context, dataType string) {
	var newError message
	newError.Message = fmt.Sprintf("Could not find %v with ID: %v", dataType, c.Params.ByName("id"))
	c.JSON(http.StatusNotFound, newError)
}

func SuccessMessage(c *gin.Context, msg string) {
	var newMsg message
	newMsg.Message = msg
	c.JSON(http.StatusOK, newMsg)
}

func GetStories(c *gin.Context) {
	c.JSON(http.StatusOK, stories)
}

func PostStory(c *gin.Context) {
	// TODO: add authorization
	var newStory models.Story

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

func UpdateStory(c *gin.Context) {
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

func DeleteStory(c *gin.Context) {
	// TODO: Add Authetication
	for idx, val := range stories {
		if val.ID == c.Params.ByName("id") {
			if idx == 0 {
				stories = stories[1:]
				SuccessMessage(c, "Successfully deleted story")
				return
			}
			if idx != len(stories)-1 {
				newSlice := make([]models.Story, 0)
				newSlice = append(newSlice, stories[:idx]...)
				stories = append(newSlice, stories[idx+1:]...)
				SuccessMessage(c, "Successfully deleted story")
				return
			}
			if idx == len(stories)-1 {
				stories = stories[:idx]
				SuccessMessage(c, "Successfully deleted story")
				return
			}
		}
	}

	IDNotFound(c, "story")
}

func GetStoryByID(c *gin.Context) {
	// TODO: add comments to the return
	for _, val := range stories {
		if val.ID == c.Params.ByName("id") {
			c.JSON(http.StatusOK, val)
			return
		}
	}

	IDNotFound(c, "story")
}

func GetCommentByID(c *gin.Context) {
	for _, val := range comments {
		if val.ID == c.Params.ByName("id") {
			c.JSON(http.StatusOK, val)
			return
		}
	}

	IDNotFound(c, "comment")
}

func PostComment(c *gin.Context) {
	// TODO: add authorization
	var newComment models.Comment

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

func UpdateComment(c *gin.Context) {
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
func DeleteComment(c *gin.Context) {
	// TODO: add authorization
	for idx, val := range comments {
		if val.ID == c.Params.ByName("id") {
			if idx == 0 {
				comments = comments[1:]
				SuccessMessage(c, "Successfully deleted comment")
			} else if idx != len(comments)-1 {
				newSlice := make([]models.Comment, 0)
				newSlice = append(newSlice, comments[:idx]...)
				comments = append(newSlice, comments[idx+1:]...)
				SuccessMessage(c, "Successfully deleted story")
			} else if idx == len(comments)-1 {
				comments = comments[:idx]
				SuccessMessage(c, "Successfully deleted story")
			}
		}
	}

	c.JSON(http.StatusInternalServerError, gin.H{"message": "Something went wrong. Unable to delete comment. Please try again later."})
}
// TODO: create route for POST /login

// TODO: create route for POST /signup

// TODO: create route for GET /user/:id

// TODO: create route for UPDATE /user/:id