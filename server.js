const express = require("express")
const { router: userRouter, handleErrors } = require("./users/userRouter")

const server = express()

server.use(express.json())
server.use("/", logger, handleErrors, userRouter)

//custom middleware

function logger(req, res, next) {
  console.log(`${req.method} to ${req.path} at ${Date.now()} `)

  next()
}

module.exports = server
