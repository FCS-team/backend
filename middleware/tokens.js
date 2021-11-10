const { sign } = require('jsonwebtoken');
// Create tokens
// ----------------------------------
const createAccessToken = user => {
  return sign({user} , process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
};

const createRefreshToken = userId => {
  return sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
};

// Send tokens
// ----------------------------------
const sendAccessToken = (res, req, accesstoken) => {
  res.header('Access-Control-Allow-Credentials', true).send({
    accesstoken,
    email: req.body.email,
  });
};

const sendRefreshToken = (res, token) => {
  res.cookie('refreshtoken', token, {
    expires: new Date(Date.now() + 50000),
    httpOnly: true,
    // path: '/refresh_token',
    // sameSite:true,
    secure:true
  });
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken
};