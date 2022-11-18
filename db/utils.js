const db = require("../db/connection");

exports.checkArticleExists = (article_id) => {
  // error if article_id is not a number
  const regex = /\d+/;
  if (!regex.test(article_id)) {
    return Promise.reject({ status: 400, msg: "Invalid article" });
  }

  return db
    .query(
      `SELECT * from articles 
      WHERE article_id = $1`,
      [article_id]
    )
    .then((res) => {
      if (res.rows.length === 0) {
        // error if article_id is a number but is not in the database
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
    });
};

exports.checkUserExists = (newComment) => {
  const user = newComment.username;
  return db
    .query(
      `SELECT * FROM users
      WHERE username = $1`,
      [user]
    )
    .then((res) => {
      if (res.rows.length === 0) {
        // error if user is not in the database
        return Promise.reject({ status: 400, msg: "Invalid User" });
      }
    });
};

exports.checkTopicExists = (topic) => {
  let queryStr = "SELECT * from topics";
  const queryValues = [];

  if (topic) {
    queryStr += ` WHERE slug = $1`;
    queryValues.push(topic);
  }
  return db.query(queryStr, queryValues).then((res) => {
    if (res.rows.length === 0) {
      // error if topic is not in the database
      return Promise.reject({ status: 400, msg: "Invalid Topic" });
    }
  });
};
