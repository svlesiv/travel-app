import { validateForm } from "./validateForm";

describe("validateForm function", () => {
  test("should show an error message if an empty string is provided for the first parameter", () => {
    expect(validateForm("", "04-10-2020")).toEqual("Please fill out the form");
  });
  test("should show an error message if an empty string is provided for the second parameter", () => {
    expect(validateForm("Boston", "")).toEqual(
      "Please fill out the form"
    );
  });
  test("should show an error message if empty strings are provided for both parameters", () => {
    expect(validateForm("", "")).toEqual(
      "Please fill out the form"
    );
  });
  test("should show an error message if numbers are provided as a city", () => {
    expect(validateForm("12Ba", "04-10-2020")).toEqual(
      "Please input a valid city"
    );
  });
  test("should return an empty string if valid input has been provided", () => {
    expect(validateForm("Boston", "04-10-2020")).toEqual("");
  });
});
