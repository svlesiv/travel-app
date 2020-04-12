# Overview
This travel app obtains a trip location and date from the user, and displays weather and an image of the location using information retrieved from the external APIs (Geonames, Dark Sky, and Pixabay).

![](./travel-app-demo.gif)

## Installation
- Clone the repository.
- Create an account with the [Geonames](http://www.geonames.org/export/web-services.html), [Dark Sky](https://darksky.net/dev), and [Pixabay](https://pixabay.com/api/docs/) to obtain API keys, and use your keys in the code.
- Install the [Allow-Control-Allow-Origin plugin](https://chrome.google.com/webstore/detail/moesif-orign-cors-changer/digfbfaphojjndkpccljibejjbppifbc?hl=en-US) to fix the CORS error.
- `cd` into `travel-app` folder and run:
  - `yarn install`
  - `yarn dev` (to build development server) or `yarn build` (production server)
  - `yarn start`

- open browser with http://localhost:8080/ to run the app in development mode.
- open browser with  http://localhost:3000/ to run the app in production mode.