//  Global Variables
const cityInputElement = document.getElementById("city");
const dateElement = document.getElementById("date");
const submitBtn = document.getElementById("submit-button");

const summaryElement = document.getElementById("summary");
const minElement = document.getElementById("min");
const maxElement = document.getElementById("max");
const dateOutputElement = document.getElementById("dateOutput");
const daysDiffElement = document.getElementById("daysDiff");
const countryElement = document.getElementById("country");
const cityPhotoElement = document.getElementById("city-photo");

const GEONAMES_URL = "http://api.geonames.org/searchJSON?q=";
const GEONAMES_USERNAME = "svlesiv";
const DARK_SKY_URL = "https://api.darksky.net/forecast";
const DARK_SKY_API_KEY = "9da39828f1d54c218d3ec4eff7240250";
const PIXABAY_URL = "https://pixabay.com/api/";
const PIXABAY_API_KEY = "15803468-e3dd677c7195cf5f44c551a6f";

let country, daysDiff, summary, min, max, imgSrc;

// Changes innerHTML properties of existing DOM elements.
const updateUI = () => {
  summaryElement.innerHTML = summary;
  minElement.innerHTML = min;
  maxElement.innerHTML = max;
  dateOutputElement.innerHTML = dateElement.value;
  daysDiffElement.innerHTML = daysDiff;
  countryElement.innerHTML = country;
  cityPhotoElement.setAttribute("src", imgSrc);
};

const getPhoto = async (baseURL, apiKey, city) => {
  const url = `${baseURL}?key=${apiKey}&q=${city}&image_type=photo`;
  const response = await fetch(url);
  try {
    return await response.json();
  } catch (err) {
    console.warn(err);
  }
};

// Function to GET Web API Data.
const getWeatherInfo = async (baseURL, apiKey, longitude, latitude, time) => {
  // https://stackoverflow.com/questions/16767301/calculate-difference-between-2-timestamps-using-javascript
  const currenDateTimestamp = Date.now() / 1000;
  // @TODO: handle timezone
  let inputTimestamp = Date.parse(time) / 1000;
  const daysDifference = Math.floor(
    (inputTimestamp - currenDateTimestamp) / 86400
  );

  daysDiff = daysDifference;

  // @TODO: handle if provided past date
  // inputTimestamp < currenDateTimestamp ? ...

  // if more than 7 days, select a day 1 year ago.
  if (inputTimestamp > currenDateTimestamp && daysDifference > 7) {
    inputTimestamp -= 31556926;
  }

  const url = `${baseURL}/${apiKey}/${longitude},${latitude},${inputTimestamp}`;
  const response = await fetch(url);
  try {
    return await response.json();
  } catch (err) {
    console.warn(err);
  }
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
// const postData = async (url = "", data = {}) => {
//   const response = await fetch(url, {
//     method: "POST",
//     credentials: "same-origin",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(data)
//   });

//   try {
//     return await response.json();
//   } catch (err) {
//     console.warn(err);
//   }
// };

// Function called by event listener to submit data.
const submitData = event => {
  event.preventDefault();
  const cityValue = cityInputElement.value;
  const dateValue = dateElement.value;

  getLatLongInfo(GEONAMES_URL, cityValue, GEONAMES_USERNAME) // get Web API Data
    .then(({ geonames }) => {
      if (geonames) {
        country = geonames[0].countryName;

        return {
          longitude: geonames[0].lng,
          latitude: geonames[0].lat
        };
      }
    })
    .then(({ longitude, latitude }) => {
      getWeatherInfo(
        DARK_SKY_URL,
        DARK_SKY_API_KEY,
        latitude,
        longitude,
        dateValue
      )
        .then(({ daily }) => {
          if (daily) {
            summary = daily.data[0].summary;
            min = daily.data[0].temperatureMin;
            max = daily.data[0].temperatureMax;
          }
        })
        .then(() => {
          getPhoto(PIXABAY_URL, PIXABAY_API_KEY, cityInputElement.value)
            .then(({ hits }) => {
              if (hits) {
                imgSrc = hits[0].webformatURL;
              }
            })
            .then(() => updateUI());
        });
    });
};

export const handleSubmit = submitBtn.addEventListener("click", submitData);
