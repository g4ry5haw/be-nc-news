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

exports.insertComment = (article_id, newComment) => {
  console.log('model - b4 check article exists')
  return checkArticleExists(article_id).then(() => {
    console.log('model - after check article exists')
    console.log(article_id, 'article_id')
    console.log(newComment, 'newComment')
    console.log(newComment.username, 'newComment.username')
    console.log(newComment.body, 'newComment.body')
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
        console.log(result.rows[0], 'model result')
        return result.rows[0];
      });
  });
};
