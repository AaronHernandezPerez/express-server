const express = require('express');
const axios = require('axios').default;

const logger = require("../middleware/logger");

const router = express.Router();

// Weather api url
const weatherApiUrl = 'https://www.metaweather.com/api/location/'

router.get('/', logger, function (req, res) {
  let params = {};

  if (req.query.query) {
    params.query = req.query.query
  } else if (req.query.lattlong) {
    params.lattlong = req.query.lattlong
  }

  axios.get(weatherApiUrl + 'search/', { params })
    .then(response => {
      if (response.data.length == 0) {
        return res.json({ error: 'No city found' })
      }
      const city = response.data[0]
      // Now we get the first city data!
      axios.get(`${weatherApiUrl}${city.woeid}/`)
        .then(response => {
          res.json(response.data);
        })
        .catch(error => {
          res.json({ error: `Search for city ${city.title} failed!` })
        });
    })
    .catch(error => {
      console.log(error)
      res.json({ error: 'Petition failed!' })
    });
});


module.exports = router;