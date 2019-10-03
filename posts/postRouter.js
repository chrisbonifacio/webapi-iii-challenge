const express = require("express")
const {
  validatePost,
  validateUserId,
  handleErrors
} = require("../middleware/index")
const Posts = require("../posts/postDb")
const Users = require("../users/userDb")

const router = express.Router()

router.get("/", async (req, res) => {
  console.log("USER ID:", req.user.id)
  const posts = await Users.getUserPosts(req.user.id)
  if (posts) {
    res.status(200).json(posts)
  } else {
    res.status(500).json({ error: "Error finding the specified user" })
  }
})

router.get("/:post_id", validatePostId, async (req, res) => {
  const post = req.post
  res.status(200).json(post)
})

router.put("/:post_id", validatePostId, async (req, res) => {
  const changes = req.body
  const postId = req.params.post_id
  try {
    const updatedPost = await Posts.update(postId, changes)
    res.status(200).json(updatedPost)
  } catch (e) {
    res.status(500).json({ error: "Error while updating the specified post" })
  }
})

router.delete("/:post_id", validatePostId, async (req, res) => {
  try {
    const removedPost = await Posts.getById(req.params.post_id)
    await Posts.remove(req.params.post_id)
    res.status(200).json(removedPost)
  } catch (e) {
    res.status(500).json({ error: "Error while deleting the specified post" })
  }
})
/**
 * custom middleware
 */

async function validatePostId(req, res, next) {
  const post = await Posts.getById(req.params.post_id)

  if (post) {
    req.post = post
    next()
  } else {
    next({ code: 400, message: "invalid post" })
  }
}

module.exports = router
