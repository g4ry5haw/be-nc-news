const db = require("../db/connection");

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
  console.log("from model selectArticlesc");
  return db
    .query(
      `
      SELECT articles.*, COUNT(comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY created_at DESC;
      `
    )
    .then((result) => {
      console.log(result.rows);
      return result.rows;
    });
};
