const express = require("express")
const Users = require("../users/userDb")

const postRouter = require("../posts/postRouter")

const router = express.Router()

const {
  validateUser,
  validateUserId,
  handleErrors
} = require("../middleware/index")

router.use(
  "/:id/posts",
  function(req, res, next) {
    req.user_id = req.params.id
    next()
  },
  postRouter
)

/**
 * setup middleware
 */
router.use("/:id", validateUserId, handleErrors)

router.get("/", handleErrors, async (req, res) => {
  const users = await Users.get()
  res.status(200).json(users)
})

router.post("/", validateUser, handleErrors, async (req, res) => {
  const user = await Users.insert(req.body)
  res.status(201).json(user)
})

router.get("/:id", (req, res) => {
  res.status(200).json(req.user)
})

router.put("/:id", validateUser, handleErrors, (req, res) => {})

router.delete("/:id", async (req, res) => {
  // await all promises, return list of resolved promises
  // deconstruct values from array for use
  const [user] = await Promise.all([
    Users.getById(req.user.id),
    Users.remove(req.user.id)
  ])

  res.status(200).json(user)
})

module.exports = router
