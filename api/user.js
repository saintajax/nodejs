const express = require("express");
const { validateUser } = require("../service/schemas/users");
const auth = require("../middlewares/authenticate");
const validateMiddleWare = require("../middlewares/validateBody");
const {
  registrationController,
  loginController,
  logoutController,
  getCurrentController,
} = require("../controller/users");

const router = express.Router();

router.post(
  "/registration",
  [validateMiddleWare(validateUser)],
  registrationController
);
router.post("/login", [validateMiddleWare(validateUser)], loginController);
router.post("/logout", auth, logoutController);
router.get("/current", auth, getCurrentController);

module.exports = router;
