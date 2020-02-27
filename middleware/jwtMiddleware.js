const jwt = require('jsonwebtoken');

// Private key, you should use RS256 and a real key
const privateKey = 'my super secret key for JWT token';

// Verify token
function verifyToken(req, res, next) {
  const bareHeader = req.headers['authorization'];

  if (!bareHeader) {
    return res.sendStatus(403);
  }

  const bearer = bareHeader.split(' ');
  const bearerToken = bearer[1];
  req.token = bearerToken;

  jwt.verify(req.token, privateKey, function (err, decoded) {
    if (err) {
      return res.json(err)
    }

    req.user = decoded;
    next();
  });
}

// Get token
function getToken(user, callback) {
  jwt.sign(user.toObject(), privateKey, callback);
}

function verifyAdmin(req, res, next) {
  if (req.user.type !== 'admin') {
    return res.status(403).json({ error: `You don't have access to this section` });
  }

  next();
}


module.exports = {
  verifyToken,
  getToken,
  verifyAdmin
}