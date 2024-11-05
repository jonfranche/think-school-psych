package main

import (
	"database/sql"
	"time"
)

type story struct {
	ID            string    `json:"id"`
	Title         string    `json:"title"`
	Date          time.Time `json:"date"`
	UserID        string    `json:"userID"`
	Username      string    `json:"username"`
	Text          string    `json:"text"`
	CommentAmount int       `json:"commentAmount"`
}

type user struct {
	ID       string    `json:"id"`
	JoinDate time.Time `json:"joinDate"`
	Username string    `json:"username"`
	Email    string    `json:"email"`
}

type comment struct {
	ID       string    `json:"id"`
	Date     time.Time `json:"date"`
	UserID   string    `json:"userID"`
	Username string    `json:"username"`
	StoryID  string    `json:"storyID"`
	Text     string    `json:"text"`
}

func (s *story) getStory(db *sql.DB) error {
	return db.QueryRow("SELECT stories.title, stories.date, users.username, users.id, stories.text "+
		"FROM stories JOIN users ON stories.userid = users.pk WHERE stories.id=$1", s.ID).Scan(&s.Title, &s.Date, &s.Username, &s.UserID, &s.Text)
}

func (s *story) updateStory(db *sql.DB) error {
	_, err :=
		db.Exec("UPDATE stories SET title=$1, text=$2 WHERE id=$3",
			s.Title, s.Text, s.ID)
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
		"SELECT stories.id, stories.title, stories.date, users.username, users.id, stories.text, COUNT(comments.storypk) "+
			"FROM stories JOIN users ON stories.userid = users.pk "+
			"LEFT JOIN comments ON stories.pk = comments.storypk "+
			"GROUP BY stories.id, stories.title, stories.date, users.username, users.id, stories.text "+
			"ORDER BY date DESC LIMIT $1 OFFSET $2",
		count, start)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	stories := []story{}

	for rows.Next() {
		var s story
		if err := rows.Scan(&s.ID, &s.Title, &s.Date, &s.Username, &s.UserID, &s.Text, &s.CommentAmount); err != nil {
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

func (u *user) checkIfUsernameInDb(db *sql.DB) (bool, error) {
	result, err := db.Query("SELECT * FROM users WHERE username=$1", u.Username)

	if err != nil {
		return false, err
	}

	if result == nil {
		return true, nil
	}

	return false, nil
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
		"SELECT comments.id, comments.date, comments.text, users.id, users.username, stories.id "+
			"FROM comments "+
			"JOIN users ON comments.userpk = users.pk "+
			"JOIN stories ON comments.storypk = stories.pk "+
			"WHERE comments.storypk = $1 "+
			"ORDER BY comments.date DESC", storyPk)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	comments := []comment{}

	for rows.Next() {
		var c comment
		if err := rows.Scan(&c.ID, &c.Date, &c.Text, &c.UserID, &c.Username, &c.StoryID); err != nil {
			return nil, err
		}
		comments = append(comments, c)
	}

	return comments, nil
}

func (c *comment) updateCommentById(db *sql.DB) error {
	_, err :=
		db.Exec("UPDATE comments SET text=$1 WHERE id=$2",
			c.Text, c.ID)
	return err
}

func (c *comment) deleteCommentById(db *sql.DB) error {
	_, err := db.Exec("DELETE FROM comments WHERE id=$1", c.ID)

	return err
}
