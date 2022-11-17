const express = require("express");
const {
  getTopics,
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postComment,
} = require("./controller/news.controller");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.use((err, req, res, next) => {
  if (err.status === 204 && err.msg === "no content") {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status === 400 && err.msg === "Invalid article") {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status === 400 && err.msg === "Bad request") {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status === 400 && err.msg === "Invalid User") {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status === 404 && err.msg === "Article not found") {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "not found" });
});

module.exports = app;
