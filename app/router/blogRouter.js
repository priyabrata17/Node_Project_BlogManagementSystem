const express = require("express");
const router = express.Router();
const wrapAsync = require("../helper/wrapAsync");
const blogController = require("../controller/blogController");
const authCheck = require("../middleware/authCheck");

router.post("/create/blog", authCheck, wrapAsync(blogController.createBlog));
router.get("/all-blogs", authCheck, wrapAsync(blogController.allBlogs));
router.patch(
  "/update/blog/:blogId",
  authCheck,
  wrapAsync(blogController.editBlog),
);
router.delete("/delete/blog", authCheck, wrapAsync(blogController.deletePost));

module.exports = router;
