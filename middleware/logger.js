// Log stream
const fs = require('fs');
const log = fs.createWriteStream('logger.log', { flags: 'a' });

// Log to json file
function logger(req, res, next) {
  let data;
  if (req.query.query) {
    data = `the place "${req.query.query}"`;
  } else if (req.query.lattlong) {
    data = `the coordinates ${req.query.lattlong}`;
  }
  if (!data) {
    return res.status(400).json({ error: 'You need to introduce a place like "query=Madrid", or coordinates separated by a coma like "lattlong=50.068,-5.316"' })
  }

  log.write(`User ${req.user.username} ${req.user._id}, consulted ${data}, at ${new Date().toUTCString()}\n`)
  next();
}

module.exports = logger;
