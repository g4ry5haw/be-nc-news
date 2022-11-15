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
            comment_count: expect.any(String),
          });
        });
      });
  });
});
