const { response } = require("../app");
const { selectTopics, selectArticles } = require("../models/news.model");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((response) => {
      res.status(200).send({topic: response});
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((response) => {
      res.status(200).send({article: response});
    })
    .catch((err) => {
      next(err);
    });
};
