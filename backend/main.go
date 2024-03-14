package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

var (
	dbName string
	dbHost string
	dbPort string
	dbUser string
	dbPassword string
)

func init() {
	err := godotenv.Load("../env/backend.env")
	if err != nil {
		log.Fatal(".env file couldn't be loaded")
	}

	dbName = os.Getenv("POSTGRES_NAME")
	dbHost = os.Getenv("DB_HOST")
	dbPort = os.Getenv("DB_PORT")
	dbUser = os.Getenv("POSTGRES_USER")
	dbPassword = os.Getenv("POSTGRES_PASSWORD")
}

func main() {
	a := App {}
	a.Initialize(dbUser, dbPassword, dbPort, dbHost, dbName)
	a.Run(":8010")
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
}
