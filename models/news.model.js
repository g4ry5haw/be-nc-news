const db = require("../db/connection");
const { checkArticleExists, checkUserExists } = require("../db/utils");

exports.selectTopics = () => {
  return db
    .query(
      `
  SELECT * FROM topics
  `
    )
    .then((result) => {
      return result.rows;
    });
};

exports.selectArticles = () => {
  return db
    .query(
      `
      SELECT articles.*, COUNT(comment_id)::INT AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY created_at DESC;
      `
    )
    .then((result) => {
      return result.rows;
    });
};

exports.selectArticleById = (article_id) => {
  return checkArticleExists(article_id).then(() => {
    return db
      .query(
        `
      SELECT * from articles
      WHERE article_id = $1
      `,
        [article_id]
      )
      .then((result) => {
        return result.rows;
      });
  });
};

exports.selectCommentsByArticleId = (article_id) => {
  return checkArticleExists(article_id).then(() => {
    return db
      .query(
        `
      SELECT * from comments
      WHERE article_id = $1
      ORDER BY created_at DESC
      `,
        [article_id]
      )
      .then((result) => {
        return result.rows;
      });
  });
};

exports.insertComment = (article_id, newComment) => {
  return checkUserExists(newComment).then(() => {
    return checkArticleExists(article_id).then(() => {
      if (!newComment.body) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      }
      return db
        .query(
          `
        INSERT INTO comments
        (article_id, author, body)
        VALUES
        ($1, $2, $3)
        RETURNING *;
        `,
          [article_id, newComment.username, newComment.body]
        )
        .then((result) => {
          return result.rows[0];
        });
    });
  });
};

exports.updateVotesById = (article_id, voteValue) => {
  return checkArticleExists(article_id).then(() => {
    //check voteValue has the correct key of 'inc_votes'
    if (!voteValue.hasOwnProperty("inc_votes")) {
      return Promise.reject({ status: 400, msg: "Incorrect key" });
    }
    //check vote value is numeric either positive or negative
    const regex = /^[-0-9]*$/;
    if (!regex.test(voteValue.inc_votes)) {
      return Promise.reject({ status: 400, msg: "Bad request" });
    }
    return db
      .query(
        `
      UPDATE articles
      SET VOTES = VOTES + $2
      WHERE article_id = $1
      RETURNING *;
      `,
        [article_id, voteValue.inc_votes]
      )
      .then((result) => {
        return result.rows;
      });
  });
};

exports.selectUsers = () => {
  return db
    .query(
      `
  SELECT * FROM users
  `
    )
    .then((result) => {
      return result.rows;
    });
};
