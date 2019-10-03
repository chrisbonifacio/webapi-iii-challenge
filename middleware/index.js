/**
 * custom middleware
 */

const Users = require("../users/userDb")
const Posts = require("../posts/postDb")

function handleErrors(error, req, res, next) {
  switch (error.code) {
    case 400:
      res.status(error.code).json({ message: error.message })
      break
    default:
      res.status(400).json({ message: "Error processing your request" })
  }
}

async function validateUserId(req, res, next) {
  const user = await Users.getById(req.params.id)

  if (user) {
    req.user = user
    next()
  } else {
    next({ code: 400, message: "invalid user id" })
  }
}

function validateUser(req, res, next) {
  if (!Object.values(req.body).length) {
    next({ code: 400, message: "missing user data" })
  } else if (!req.body.name) {
    next({ code: 400, message: "missing required name field" })
  } else {
    next()
  }
}

function validatePost(req, res, next) {
  if (!Object.values(req.body).length) {
    next({ code: 400, message: "missing post data" })
  } else if (!req.body.text) {
    next({ code: 400, message: "missing required text field" })
  } else {
    next()
  }
}

module.exports = { validateUser, validateUserId, validatePost, handleErrors }
