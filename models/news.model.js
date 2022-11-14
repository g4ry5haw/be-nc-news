const db = require("../db/connection");

exports.selectTopics = () => {
  return db
    .query(
      `
  SELECT * from topics
  `
    )
    .then((result) => {
      console.log('model')
      return result.rows;
    });
};
