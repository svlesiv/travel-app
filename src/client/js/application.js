//  Global Variables
const zipInputElement = document.getElementById("zip");
const userFeelingsInputElement = document.getElementById("feelings");

const dateElement = document.getElementById("date");
const tempElement = document.getElementById("temp");
const contentElement = document.getElementById("content");
const submitBtn = document.getElementById("generate");

const baseURL = "https://api.openweathermap.org/data/2.5/weather";
// Personal API Key for OpenWeatherMap API
const apiKey = "7d34d0d51c4d8414e836358a1c769e59";

// Creates and formats a new date.
const getCurrentDate = () => {
  const d = new Date();
  return d.getMonth() + "." + d.getDate() + "." + d.getFullYear();
};

// Changes innerHTML properties of existing DOM elements.
const updateUI = data => {
  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  tempElement.innerHTML = data.temperature;
  dateElement.innerHTML = data.date;
  contentElement.innerHTML = data.userResponse;
};

// Function to GET Web API Data.
const getWeatherInfo = async (baseURL, zipValue, apiKey) => {
  if (!zipValue) {
    window.alert("Please enter a zip code");
    return null;
  }

  const url = `${baseURL}?zip=${zipValue}&APPID=${apiKey}`;
  const response = await fetch(url);

  try {
    return await response.json();
  } catch (err) {
    console.warn(err);
  }
};

// Function to POST data.
const postData = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  try {
    return await response.json();
  } catch (err) {
    console.warn(err);
  }
};

// Function to GET Project Data.
const getProjectData = async () => {
  const request = await fetch("/all");

  try {
    return await request.json();
  } catch (err) {
    console.warn(err);
  }
};

// Function called by event listener to submit data.
const submitData = () => {
  const zipValue = zipInputElement.value;

  getWeatherInfo(baseURL, zipValue, apiKey) // get Web API Data
    .then(
      data => {
        data
          ? postData("/add", {
              // post data to 'add' route
              temperature: data.main.temp,
              date: getCurrentDate(),
              userFeelings: userFeelingsInputElement.value
            })
          : null;
      },
      err => console.warn(err)
    )
    .then(() => getProjectData().then(data => updateUI(data))); // update existing DOM elements
};

export const handleSubmit = submitBtn.addEventListener("click", submitData);
