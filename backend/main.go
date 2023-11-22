package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/jonfranche/thinkschoolpsych/backend/internal/controllers"
	"github.com/jonfranche/thinkschoolpsych/backend/internal/models"
)

func main() {
	fmt.Println(models.Users)

	r := gin.Default()
	r.GET("/api/stories", controllers.GetStories)
	r.POST("/api/stories/new", controllers.PostStory)
	r.PATCH("/api/stories/edit/:id", controllers.UpdateStory)
	r.DELETE("/api/stories/edit/:id", controllers.DeleteStory)
	r.GET("/api/stories/:id", controllers.GetStoryByID)
	r.GET("/api/comments/:id", controllers.GetCommentByID)
	r.POST("/api/comments/", controllers.PostComment)
	r.PATCH("/api/comments/:id", controllers.UpdateComment)
	r.DELETE("/api/comments/:id", controllers.DeleteComment)
	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
