const userController = require("../controller/userController");
const wrapAsync = require("../helper/wrapAsync");
const imageUpload = require("../helper/fileUpload");
const authCheck = require("../middleware/authCheck");

const express = require("express");
const router = express.Router();

router.post(
  "/auth/signup",
  imageUpload.single("image"),
  wrapAsync(userController.signup),
);

router.post("/auth/login", wrapAsync(userController.login));

router.patch(
  "/auth/update-image",
  authCheck,
  imageUpload.single("image"),
  wrapAsync(userController.logout),
);

router.get("/auth/dashboard", authCheck, wrapAsync(userController.dashboard));

module.exports = router;
