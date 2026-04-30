const express = require("express");
const router = express.Router();
const authCheck = require("../middleware/authCheck");
const categoryController = require("../controller/categoryController");
const wrapAsync = require("../helper/wrapAsync");

router.post(
  "/create/category",
  authCheck,
  wrapAsync(categoryController.createCategory),
);
router.patch(
  "/update/category/:categoryId",
  authCheck,
  wrapAsync(categoryController.updateCategory),
);
router.delete(
  "/delete/category/:categoryId",
  authCheck,
  wrapAsync(categoryController.deleteCategory),
);

module.exports = router;
