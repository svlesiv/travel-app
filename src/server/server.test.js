// Testing the API Endpoints

const request = require("supertest");
const server = require("./server");

describe("Get Endpoints", () => {
  // https://blog.campvanilla.com/jest-expressjs-and-the-eaddrinuse-error-bac39356c33a
  test("should return status 200 when getting `/`", async () => {
    const res = await request(server).get('/');

    expect(res.statusCode).toEqual(200);
  });
});
