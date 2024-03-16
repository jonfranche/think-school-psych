package main

import (
	"database/sql"
	"time"
	"log"

	"github.com/google/uuid"
)

type story struct {
	ID string `json:"id"`
	Title string `json:"title"`
	Date time.Time `json:"date"`
	UserID string `json:"userID"`
	Text string `json:"text"`
}

type user struct {
	ID string `json:"id"`
	JoinDate time.Time `json:"joinDate"`
	Username string `json:"username"`
	Email string `json:"email"`
	Password string `json:"password"`
}

// type comment struct {
// 	ID string `json:"id"`
// 	Date time.Time `json:"date"`
// 	UserID string `json:"userID"`
// 	BlogID string `json:"blogID"`
// 	Text string `json:"text"`
// }

func (s *story) getStory(db *sql.DB) error {
	return db.QueryRow("SELECT title, date, userID, text FROM stories WHERE id=$1", 
		s.ID).Scan(&s.Title, &s.Date, &s.UserID, &s.Text)
}

func (s *story) updateStory(db *sql.DB) error {
	_, err :=
		db.Exec("UPDATE stories SET title=$1, date=$2, userID=$3, text=$4 WHERE id=$5",
			s.Title, s.Date, s.UserID, s.Text)
	return err
}

func (s *story) deleteStory(db *sql.DB) error {
	_, err := db.Exec("DELETE FROM stories WHERE id=$1", s.ID)

	return err
}

func (s *story) createStory(db *sql.DB) error {
	err := db.QueryRow(
		"INSERT INTO stories(title, date, USERID, text) VALUES ($1, $2, $3, $4) RETURNING id",
		s.Title, s.Date, s.UserID, s.Text).Scan(&s.ID)

	if err != nil {
		return err
	}

	return nil
}

func getStories(db *sql.DB, start, count int) ([]story, error) {
	rows, err := db.Query(
		"SELECT id, title, date, userID, text FROM stories LIMIT $1 OFFSET $2",
		count, start)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	stories := []story{}

	for rows.Next() {
		var s story
		if err := rows.Scan(&s.ID, &s.Title, &s.Date, &s.UserID, &s.Text); err != nil {
			return nil, err
		}
		db.QueryRow("SELECT id FROM users WHERE pk=$1", s.UserID).Scan(&s.UserID)
		stories = append(stories, s)
	}

	return stories, nil
}

func (u *user) createUser(db *sql.DB) error {
	err := db.QueryRow(
		"INSERT INTO users(username, joindate, email, password) VALUES ($1, $2, $3, $4) RETURNING id",
		u.Username, u.JoinDate, u.Email, u.Password).Scan(&u.ID)

	if err != nil {
		return err
	}

	return nil
}

func (s *story) getUserUuidById(db *sql.DB) error {
	return db.QueryRow("SELECT id FROM users WHERE pk=$1", s.UserID).Scan(&s.UserID)
}

func (u *user) getUserIdByUuid(db *sql.DB) error {
	id, err := uuid.Parse(u.ID)
	if err != nil {
		log.Fatal("Error occurred when creating UUID from bytes")
	}
	return db.QueryRow("SELECT pk FROM users WHERE id=$1", id).Scan(&u.ID)
}

func getUsers(db *sql.DB) ([]user, error) {
	rows, err := db.Query("SELECT username FROM users")

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	users := []user{}

	for rows.Next() {
		var u user
		if err := rows.Scan(&u.Username); err != nil {
			return nil, err
		}
		users = append(users, u)
	}

	return users, nil
}
// var Stories = []Story {
// 	{
// 		ID: "1", 
// 		Date: time.Date(2022, 6, 12, 0, 0, 0, 0, time.Local), 
// 		UserID: "1", 
// 		CommentIDs: []string{"1", "2", "3"}, 
// 		Title: "Lorem Ipsum Dolor", 
// 		Text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
// 	},
// 	{
// 		ID: "2", 
// 		Date: time.Date(2022, 11, 3, 0, 0, 0, 0, time.Local), 
// 		UserID: "1", 
// 		CommentIDs: []string{"4", "5"}, 
// 		Title: "Dummy Blog Title", 
// 		Text: "This is placeholder text to test the blog functionality. This blog was made by user 1. It has 2 comments.",
// 	},
// }

// var Users = []User {
// 	{
// 		ID: "1", 
// 		JoinDate: time.Date(2022, 6, 11, 0, 0, 0, 0, time.Local), 
// 		Name: "fakeuser1",
// 		Email: "fakeuser1@test.com",
// 		Password: "password123",
// 	},
// 	{
// 		ID: "2",
// 		JoinDate: time.Date(2022, 7, 20, 0, 0, 0, 0, time.Local),
// 		Name: "testuser2",
// 		Email: "testuser2@test.com",
// 		Password: "password123",
// 	},
// }

// var Comments = []Comment {
// 	{
// 		ID: "1",
// 		Date: time.Date(2022, 7, 20, 0, 0, 0, 0, time.Local),
// 		UserID: "2",
// 		BlogID: "1",
// 		Text: "Wow great post!",
// 	  },
// 	  {
// 		ID: "2",
// 		Date: time.Date(2022, 7, 21, 0, 0, 0, 0, time.Local),
// 		UserID: "1",
// 		BlogID: "1",
// 		Text: "Thanks, testuser2!",
// 	  },
// 	  {
// 		ID: "3",
// 		Date: time.Date(2022, 7, 21, 0, 0, 0, 0, time.Local),
// 		UserID: "2",
// 		BlogID: "1",
// 		Text: "You're welcome!",
// 	  },
// 	  {
// 		ID: "4",
// 		Date: time.Date(2022, 11, 3, 0, 0, 0, 0, time.Local),
// 		UserID: "2",
// 		BlogID: "2",
// 		Text: "Another well written blog, fakeuser1.",
// 	  },
// 	  {
// 		ID: "5",
// 		Date: time.Date(2022, 11, 4, 0, 0, 0, 0, time.Local),
// 		UserID: "1",
// 		BlogID: "2",
// 		Text: "Thanks so much, testuser2!",
// 	  },
// }
