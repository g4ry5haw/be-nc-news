const app = require("../app.js");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});

describe("GET /api/topics", () => {
  test("200: returns an array of topic objects with the properties slug & description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topic).toBeInstanceOf(Array);
        expect(body.topic).not.toHaveLength(0);
        body.topic.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });

  test("404: returns an error for an api that is not found", () => {
    return request(app)
      .get("/api/not-a-route")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("not found");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: returns an array of article objects with the correct properties & sorted by date descending ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toBeInstanceOf(Array);
        expect(body.article).not.toHaveLength(0);
        expect(body.article).toBeSortedBy("created_at", { descending: true });
        body.article.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: returns an article object with the correct properties ", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toBeInstanceOf(Array);
        expect(body.article).toHaveLength(1);
        body.article.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 1,
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("400: returns an error for an invalid article id", () => {
    return request(app)
      .get("/api/articles/dog")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("404: returns an error for a well formed article id that is not found", () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: returns an array of comments with the correct properties for the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);
        expect(body.comments).not.toHaveLength(0);
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1,
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("400: returns an error for an invalid article id", () => {
    return request(app)
      .get("/api/articles/dog/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("404: returns an error for a well formed article id that is not found", () => {
    return request(app)
      .get("/api/articles/99999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: returns an empty array when the article_id has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: request body accepts an object with username and body & responds with the posted comment", () => {
    const newComment = {
      username: "rogersop",
      body: "There are 2 rules in life.  1. Never give away all your secrets  2.",
    };
    return request(app)
      .post("/api/articles/6/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: expect.any(Number),
          body: newComment.body,
          article_id: 6,
          author: newComment.username,
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("400: responds with an appropriate error message when provided with no comment", () => {
    const newComment = {
      username: "rogersop",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("400: returns an error for an invalid user", () => {
    const newComment = {
      username: "footy_fan",
      body: "it's coming home....it's coming home.. etc. etc.",
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid User");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("400: returns an error for a comment posted on an invalid article id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "My wife asked if I'd seen the dog bowl? I said I didn't know he could bowl!",
    };
    return request(app)
      .post("/api/articles/dadjoke/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("404: returns an error for a comment posted on a well formed article id that is not found", () => {
    const newComment = {
      username: "icellusedkars",
      body: "What is the airspeed velocity of an unladen swallow?",
    };
    return request(app)
      .get("/api/articles/123456/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("201: request body accepts an object with newVote of +10 & responds with the updated article", () => {
    const voteUpdate = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/1")
      .send(voteUpdate)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toBeInstanceOf(Array);
        expect(body.article).toHaveLength(1);
        body.article.forEach((article) => {
          expect(article).toMatchObject({
            article_id: 1,
            author: expect.any(String),
            title: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: 110,
          });
        });
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("201: request body accepts an object with newVote of -10 & responds with the updated article", () => {
    const voteUpdate = { inc_votes: -10 };
    return request(app)
      .patch("/api/articles/2")
      .send(voteUpdate)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toBeInstanceOf(Array);
        expect(body.article).toHaveLength(1);
        body.article.forEach((article) => {
          expect(article).toMatchObject({
            article_id: 2,
            author: expect.any(String),
            title: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: -10,
          });
        });
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("400: responds with an appropriate error message when the vote is not a number", () => {
    const voteUpdate = { inc_votes: "ten" };
    return request(app)
      .patch("/api/articles/2")
      .send(voteUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("400: returns an error for a vote on an invalid article id", () => {
    const voteUpdate = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/cats/")
      .send(voteUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("404: returns an error for a vote posted on a well formed article id that is not found", () => {
    const voteUpdate = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/54321/")
      .send(voteUpdate)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("400: returns an error for an incorrect key on the body", () => {
    const voteUpdate = { wrong_key: 10 };
    return request(app)
      .patch("/api/articles/5/")
      .send(voteUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Incorrect key");
      });
  });
});

describe("GET /api/users", () => {
  test("200: returns an array of user objects with the correct properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toBeInstanceOf(Array);
        expect(body.users).not.toHaveLength(0);
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
