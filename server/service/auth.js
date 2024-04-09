const jwt = require('jsonwebtoken')
require('dotenv').config()
const secret = process.env.JWT

function setUser(user) {  
  return jwt.sign({
    _id: user._id,
    email: user.email,
  }, secret)
}

function getUser(token) {
  if (!token) return null
  return jwt.verify(token, secret) // returning the session id
}

module.exports = {
  setUser,
  getUser,
};