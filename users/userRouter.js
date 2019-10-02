const express = require("express")

const Users = require("../users/userDb")

const router = express.Router()

router.use("/:id", validateUserId, handleErrors)

router.post("/", (req, res) => {})

router.post("/:id/posts", (req, res) => {})

router.get("/", (req, res) => {})

router.get("/:id", (req, res) => {
  res.json(req.user)
})

router.get("/:id/posts", (req, res) => {})

router.delete("/:id", (req, res) => {})

router.put("/:id", (req, res) => {})

//custom middleware

function handleErrors(error, req, res, next) {
  switch (error.code) {
    case 400:
      res.status(error.code).json({ message: error.message })
      break
    default:
      res.status(500).json({ message: "Error processing your request" })
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
  if (!req.body) {
    next({ code: 400, message: "missing user data" })
  } else if (!req.body.name) {
    next({ code: 400, message: "missing required name field" })
  }
}

function validatePost(req, res, next) {
  if (!req.body) {
    next({ code: 400, message: "missing post data" })
  }

  if (!req.body.text) {
    next({ code: 400, message: "missing required text field" })
  }
}

module.exports = { router, handleErrors }
