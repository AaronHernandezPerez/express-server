const app = require('./app')
const mongoose = require('mongoose');

// Mongo DB connection
mongoose.connect('mongodb://root:password@mongo:27017', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started at http://localhost:${port}`))
