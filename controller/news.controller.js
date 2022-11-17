const { response } = require("../app");
const {
  selectTopics,
  selectArticles,
  selectArticleById,
  selectCommentsByArticleId,
  insertComment,
  updateVotesById,
} = require("../models/news.model");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((response) => {
      res.status(200).send({ topic: response });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((response) => {
      res.status(200).send({ article: response });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((response) => {
      res.status(200).send({ article: response });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id)
    .then((response) => {
      res.status(200).send({ comments: response });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  insertComment(article_id, newComment)
    .then((response) => {
      res.status(201).send({ comment: response });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVotesById = (req, res, next) => {
  const { article_id } = req.params;
  const voteValue = req.body;
  updateVotesById(article_id, voteValue)
    .then((response) => {
      res.status(201).send({ article: response });
    })
    .catch((err) => {
      next(err);
    });
};
