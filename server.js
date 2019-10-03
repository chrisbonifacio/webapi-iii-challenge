const express = require("express")
const userRouter = require("./users/userRouter")
const postRouter = require("./posts/postRouter")
const Posts = require("./posts/postDb")
const Users = require("./users/userDb")

const {
  handleErrors,
  validateUserId,
  validatePost
} = require("./middleware/index")

const server = express()

server.use("/", express.json(), logger, userRouter)
server.use("/:id/posts", postRouter)

server.post("/:id/posts", validatePost, async (req, res) => {
  console.log("ID:", req.params.id)
  try {
    var newPost = await Posts.insert({
      user_id: req.params.id,
      text: req.body.text
    })
    res.status(200).json(newPost)
  } catch (e) {
    res.status(500).json({ error: "Error while adding post to database" })
  }
})

//custom middleware

function logger(req, res, next) {
  console.log(`${req.method} to ${req.path} at ${Date.now()} `)

  next()
}

module.exports = server
