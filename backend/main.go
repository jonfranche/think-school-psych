package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/jonfranche/thinkschoolpsych/backend/internal/controllers"
	"github.com/jonfranche/thinkschoolpsych/backend/internal/models"
	_ "github.com/lib/pq"
)

func main() {
	fmt.Println(models.Users)

	// Get .env variables
	err := godotenv.Load("../env/postgres.env")
	if err != nil {
		log.Fatal(".env file couldn't be loaded")
	}

	dbName := os.Getenv("DB_NAME")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")

	// Connect to Database
	connStr := fmt.Sprintf("user=%s password=%s dbname=%s host=%s port=%s", dbUser, dbPassword, dbName, dbHost, dbPort)
	
	fmt.Println("Connecting to Database...")
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Could not connect to Database")
	}
	fmt.Println("Database connected")

	if err := db.Ping(); err!= nil {
		log.Fatal(err)
	}
	
	// Set up Server
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
