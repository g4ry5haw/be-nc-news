const { selectTopics } = require("../models/news.model");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      console.log('controller error')
      next(err);
    });
};
