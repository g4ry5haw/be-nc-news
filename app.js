const express = require("express");
const { getTopics } = require("./controller/news.controller");

const app = express();

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  console.log(err.status);
  if (err.status === 204 && err.msg === "no content") {
    res.status(err.status).send({ msg: err.msg });
  }
});

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "not found" });
});

module.exports = app;
