// Testing the API Endpoints

const request = require("supertest");
const server = require("./server");

describe("Get Endpoints", () => {
  // https://blog.campvanilla.com/jest-expressjs-and-the-eaddrinuse-error-bac39356c33a
  test("should return status 200 when getting `/`", async () => {
    const res = await request(server).get("/");

    expect(res.statusCode).toEqual(200);
  });
});

describe("Post Endpoints", () => {
  const projectData = {
    summary: "summary",
    max: 10,
    min: 5,
    date: "04-05-2020",
    daysDiff: 2,
    country: "USA",
    imgSrc: "https://address.png",
    city: "Boston"
  };

  test("should post project data", async () => {
    const res = await request(server)
      .post("/add")
      .send(projectData);

    expect(res.body).toEqual(projectData);
  });
});
