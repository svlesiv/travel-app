//  Global Variables
const cityInputElement = document.getElementById("city");

const latitudeElement = document.getElementById("latitude");
const longitudeElement = document.getElementById("longitude");
const countryElement = document.getElementById("country");
const submitBtn = document.getElementById("generate");

const GEONAMES_URL = "http://api.geonames.org/searchJSON?q=";
const GEONAMES_USERNAME = "svlesiv";

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

  latitudeElement.innerHTML = data.latitude;
  longitudeElement.innerHTML = data.longitude;
  countryElement.innerHTML = data.country;
};

// Function to GET Web API Data.
const getLatLongInfo = async (baseURL, city, username) => {
  const url = `${baseURL}${city}&maxRows=10&username=${username}`;
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

// Function called by event listener to submit data.
const submitData = (event) => {
  event.preventDefault();
  const cityValue = cityInputElement.value;

  getLatLongInfo(GEONAMES_URL, cityValue, GEONAMES_USERNAME) // get Web API Data
    .then(
      ({ geonames }) => {
        if (geonames) {
          return postData("http://localhost:3000/add", {
            // post data to 'add' route
            longitude: geonames[0].lng,
            latitude: geonames[0].lat,
            country: geonames[0].countryName
          });
        }
      },
      err => console.warn(err)
    )
    .then(data => {
      updateUI(data);
    }); // update existing DOM elements
};

export const handleSubmit = submitBtn.addEventListener("click", submitData);
