const express = require('express');

const jwtMiddleware = require("./middleware/jwtMiddleware");

const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// import Routes
const controlRoutes = require('./routes/control');
app.use('/control', controlRoutes);
const weatherRoutes = require('./routes/weather');
app.use('/weather', jwtMiddleware.verifyToken, weatherRoutes);
const adminRoutes = require('./routes/admin');
app.use('/admin', jwtMiddleware.verifyToken, adminRoutes);

app.get('/', function (req, res) {
  res.send('Aaron Hernandez API!')
});

module.exports = app