const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { validateUser } = require("../service/schemas/users");
const auth = require("../middlewares/authenticate");
const validateMiddleWare = require("../middlewares/validateBody");
const {
  registrationController,
  loginController,
  logoutController,
  getCurrentController,
  registrationConfirmationController,
  resendEmail,
} = require("../controller/users");
const { uploadController } = require("../controller/files");

const FILES_TMP = path.resolve("./tmp");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, FILES_TMP);
  },
  filename: (req, file, cb) => {
    const [_, ext] = file.originalname.split(".");
    cb(null, `${uuidv4()}.${ext}`);
  },
});

const router = express.Router();
const uploadMiddleware = multer({ storage });

router.post(
  "/registration",
  [validateMiddleWare(validateUser)],
  registrationController
);
router.get("/verify/:verificationToken", registrationConfirmationController);
router.post("/login", [validateMiddleWare(validateUser)], loginController);
router.post("/logout", auth, logoutController);
router.get("/current", auth, getCurrentController);
router.patch(
  "/avatar",
  [auth, uploadMiddleware.single("avatar")],
  uploadController
);
router.post("/verify", resendEmail);

module.exports = router;
