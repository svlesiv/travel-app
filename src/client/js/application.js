//  Global Variables
const cityInputElement = document.getElementById("city");
const dateElement = document.getElementById("date");
const submitBtn = document.getElementById("submit-button");

const summaryElement = document.getElementById("summary");
const minElement = document.getElementById("min");
const maxElement = document.getElementById("max");
const dateOutputElement = document.getElementById("dateOutput");
const cityOutputElement = document.getElementById("cityOutput");
const daysDiffElement = document.getElementById("daysDiff");
const countryElement = document.getElementById("country");
const cityPhotoElement = document.getElementById("city-photo");
const cardElement = document.getElementById("card");
const loadingElement = document.getElementById("loading");
const errorElement = document.getElementById("error");
const predictionElement = document.getElementById("weather-prediction");

const GEONAMES_URL = "http://api.geonames.org/searchJSON?q=";
const GEONAMES_USERNAME = "svlesiv";
const DARK_SKY_URL = "https://api.darksky.net/forecast";
const DARK_SKY_API_KEY = "9da39828f1d54c218d3ec4eff7240250";
const PIXABAY_URL = "https://pixabay.com/api/";
const PIXABAY_API_KEY = "15803468-e3dd677c7195cf5f44c551a6f";

let country, city, daysDiff, summary, min, max, imgSrc;

// Changes innerHTML properties of existing DOM elements.
const updateUI = res => {
  const { summary, min, max, date, daysDiff, country, imgSrc, city } = res;

  // Depending on when the trip is, display a message which indicates
  // whether the forecast is precise.
  if (daysDiff <= 7 && daysDiff >= 0) {
    predictionElement.innerHTML = "The weather for this days is:";
  } else {
    predictionElement.innerHTML = "Typical weather for that day is:";
  }

  // update DOM elements
  summaryElement.innerHTML = summary;
  minElement.innerHTML = min;
  maxElement.innerHTML = max;
  dateOutputElement.innerHTML = date;
  daysDiffElement.innerHTML = daysDiff;
  countryElement.innerHTML = country;
  // convert first letter to uppercase
  cityOutputElement.innerHTML = city.charAt(0).toUpperCase() + city.slice(1);
  cityPhotoElement.setAttribute("src", imgSrc);

  loadingElement.style.display = "none";
  cardElement.style.display = "flex";
};

const getPhoto = async (baseURL, apiKey, city) => {
  let url = `${baseURL}?key=${apiKey}&q=${city}&image_type=photo`;
  const response = await fetch(url);

  try {
    return await response.json().then(res => {
      // if cannot find image of a provided city
      // fall back to a country
      if (res.totalHits === 0) {
        url = `${baseURL}?key=${apiKey}&q=${country}&image_type=photo`;

        return fetch(url).then(res => res.json());
      }

      return res;
    });
  } catch (err) {
    console.warn(err);
  }
};

// Function to GET Web API Data.
const getWeatherInfo = async (baseURL, apiKey, longitude, latitude, time) => {
  // https://stackoverflow.com/questions/16767301/calculate-difference-between-2-timestamps-using-javascript
  const currenDateTimestamp = new Date() / 1000;
  let inputTimestamp = Date.parse(time) / 1000;
  const daysDifference = Math.ceil(
    (inputTimestamp - currenDateTimestamp) / 86400
  );

  daysDiff = daysDifference;

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
const submitData = event => {
  event.preventDefault();

  loadingElement.style.display = "block";

  city = cityInputElement.value;
  const dateValue = dateElement.value;

  const errorMsg = Client.validateForm(city, dateValue);

  // if errorMsg is not empty, hide loading element and
  // display error message received from the function
  if (errorMsg) {
    loadingElement.style.display = "none";
    errorElement.style.display = "block";

    errorElement.innerHTML = errorMsg;
    window.setTimeout(() => (errorElement.innerHTML = ""), 3000);
    return;
  }

  getLatLongInfo(GEONAMES_URL, city, GEONAMES_USERNAME)
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
          getPhoto(PIXABAY_URL, PIXABAY_API_KEY, city)
            .then(({ hits }) => {
              if (hits) {
                // randomly select an image among available hits
                const randomInt = Math.floor(Math.random() * (hits.length - 1));
                imgSrc = hits[randomInt].webformatURL;
              }
            })
            .then(() =>
              postData("http://localhost:3000/add", {
                summary,
                max,
                min,
                date: dateElement.value,
                daysDiff,
                country,
                city,
                imgSrc
              }).then(res => updateUI(res))
            );
        });
    });
};

export const handleSubmit = submitBtn.addEventListener("click", submitData);
