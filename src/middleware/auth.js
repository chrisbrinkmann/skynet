const jwt = require('jsonwebtoken')
const User = require('../models/User')

/**
 * This middleware checks that any routes requiring authorization
 * get a valid jsonwebtoken passed in the request header.
 * 
 * If a valid token is provided, the user object will be extracted from
 * the token payload and attached to the request so it is accessible
 * in the protected endpoint.
 */

module.exports = async function(req, res, next) {
  // get token from req header
  const token = req.header('x-auth-token')

  // check for no token in header
  if (!token) {
    return res.status(401).json({ msg: 'No token; authorization denied' })
  }

  try {
    // cache the user id (payload returned from jwt.verify)
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // confirm id in token payload matches an existing user
    const user = await User.findOne({ where: { id: decoded.id } })
    if (!user) throw new Error()

    // attach the user id to the request
    req.user = decoded

    // call next to proceed to the route
    next()
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token; authorization denied' })
  }
}
