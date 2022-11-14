const express = require("express");
const { getTopics } = require("./controller/news.controller");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  if (err.status === 204 && err.msg === "no content") {
    res.status(err.status).send({ msg: err.msg });
  }
});

module.exports = app;
