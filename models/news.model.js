const db = require("../db/connection");
const { checkArticleExists } = require("../db/utils");

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
