package main

import (
	"database/sql"
	"time"
)

type story struct {
	ID       string    `json:"id"`
	Title    string    `json:"title"`
	Date     time.Time `json:"date"`
	UserID   string    `json:"userID"`
	Username string    `json:"username"`
	Text     string    `json:"text"`
}

type user struct {
	ID       string    `json:"id"`
	JoinDate time.Time `json:"joinDate"`
	Username string    `json:"username"`
	Email    string    `json:"email"`
}

type comment struct {
	ID      string    `json:"id"`
	Date    time.Time `json:"date"`
	UserID  string    `json:"userID"`
	StoryID string    `json:"storyID"`
	Text    string    `json:"text"`
}

func (s *story) getStory(db *sql.DB) error {
	return db.QueryRow("SELECT stories.title, stories.date, users.username, stories.text "+
		"FROM stories JOIN users ON stories.userid = users.pk WHERE stories.id=$1", s.ID).Scan(&s.Title, &s.Date, &s.UserID, &s.Text)
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
		"SELECT stories.id, stories.title, stories.date, users.username, users.id, stories.text "+
			"FROM stories JOIN users ON stories.userid = users.pk ORDER BY date DESC LIMIT $1 OFFSET $2",
		count, start)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	stories := []story{}

	for rows.Next() {
		var s story
		if err := rows.Scan(&s.ID, &s.Title, &s.Date, &s.Username, &s.UserID, &s.Text); err != nil {
			return nil, err
		}
		stories = append(stories, s)
	}

	return stories, nil
}

func (u *user) createUser(db *sql.DB) error {
	err := db.QueryRow(
		"INSERT INTO users(id, username, joindate, email) VALUES ($1, $2, $3, $4) RETURNING id",
		u.ID, u.Username, u.JoinDate, u.Email).Scan(&u.ID)

	if err != nil {
		return err
	}

	return nil
}

// func (s *story) getUserUidById(db *sql.DB) error {
// 	return db.QueryRow("SELECT id FROM users WHERE pk=$1", s.UserID).Scan(&s.UserID)
// }

// func (u *user) getUserPasswordByEmail(db *sql.DB) error {
// 	return db.QueryRow("SELECT id, password FROM users WHERE email=$1", u.Email).Scan(&u.ID, &u.Password)
// }

func (u *user) getUserIdByUid(db *sql.DB) error {
	return db.QueryRow("SELECT pk FROM users WHERE id=$1", u.ID).Scan(&u.ID)
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

func (c *comment) createComment(db *sql.DB) error {
	// get user id
	var upk int
	err := db.QueryRow("SELECT pk FROM users WHERE id=$1", c.UserID).Scan(&upk)
	if err != nil {
		return err
	}

	// get story id
	var spk int
	err = db.QueryRow("SELECT pk FROM stories WHERE id=$1", c.StoryID).Scan(&spk)
	if err != nil {
		return err
	}

	// store comment
	err = db.QueryRow(
		"INSERT INTO comments(id, date, userpk, storypk, text) VALUES ($1, $2, $3, $4, $5) RETURNING id",
		c.ID, c.Date, upk, spk, c.Text).Scan(&c.ID)

	if err != nil {
		return err
	}

	return nil
}

func getCommentsByStoryId(db *sql.DB, storyId string) ([]comment, error) {
	var storyPk int
	db.QueryRow("SELECT pk FROM stories WHERE id=$1", storyId).Scan(&storyPk)

	rows, err := db.Query(
		"SELECT comments.id, comments.date, comments.text, users.username, stories.id "+
			"FROM comments "+
			"JOIN users ON comments.userpk = users.pk "+
			"JOIN stories ON comments.storypk = $1 ORDER BY comments.date DESC", storyPk)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	comments := []comment{}

	for rows.Next() {
		var c comment
		if err := rows.Scan(&c.ID, &c.Date, &c.Text, &c.UserID, &c.StoryID); err != nil {
			return nil, err
		}
		comments = append(comments, c)
	}

	return comments, nil
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
