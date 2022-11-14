const db = require("../db/connection");

exports.selectTopics = () => {
  return db
    .query(
      `
  SELECT * from topics
  `
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 204,
          msg: "no content",
        });
      }
      return result.rows;
    });
};
