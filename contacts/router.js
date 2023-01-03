const express = require("express");

const {
  listContacts,
  findContactsById,
  createContact,
  updateContact,
  deleteContact,
} = require("./controllers");

const router = express.Router();

router.get("/", listContacts);
router.get("/:id", findContactsById);
router.post("/", createContact);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);

module.exports = router;
