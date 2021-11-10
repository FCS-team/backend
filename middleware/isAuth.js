const { verify } = require('jsonwebtoken');
const {userName} = require('../models/credential')

const isAuth = req => {
  const authorization = req.headers['authorization'];
  if (!authorization) throw new Error('You need to login.');
  // Based on 'Bearer ksfljrewori384328289398432'
  const token = authorization.split(' ')[1];
  const user  = verify(token, process.env.ACCESS_TOKEN_SECRET);
  if(userName.findOne({_id:user.user_name}))return user
  return false
};
const isRefresh = token => {
    const {userId} = verify(token, process.env.REFRESH_TOKEN_SECRET)
    return userId
}

module.exports = {
  isAuth, isRefresh
};