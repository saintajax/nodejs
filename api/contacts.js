const express = require("express");
const auth = require("../middlewares/authenticate");
const {
  listContacts,
  findContactsById,
  createContact,
  updateOneContact,
  deleteContact,
} = require("../controller/contacts");

const router = express.Router();

router.use(auth);

router.get("/", listContacts);
router.get("/:id", findContactsById);
router.post("/", createContact);
router.patch("/:id/favorite", updateOneContact);
router.put("/:id", updateOneContact);
router.delete("/:id", deleteContact);

module.exports = router;
