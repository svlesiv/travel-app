import { submitData } from "./application.js";

const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(
  path.resolve(__dirname, "../views/index.html"),
  "utf8"
);

jest.dontMock("fs");

describe("submit button", () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
  });

  afterEach(() => {
    // https://dev.to/snowleo208/things-i-learned-after-writing-tests-for-js-and-html-page-4lja
    // restore the original func after test
    jest.resetModules();
  });

  test("submit button should exists", () => {
    expect(document.getElementById("submit-button")).toBeTruthy();
  });
});

describe("submitData", () => {
  test("submitData should be a fuction", () => {
    expect(submitData).toBeInstanceOf(Function);
  });
});
