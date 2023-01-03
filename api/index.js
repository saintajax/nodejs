const express = require("express");
const {
  listContacts,
  findContactsById,
  createContact,
  updateOneContact,
  deleteContact,
} = require("../controller");

const router = express.Router();

router.get("/contacts", listContacts);
router.get("/contacts/:id", findContactsById);
router.post("/contacts", createContact);
router.patch("/contacts/:id/favorite", updateOneContact);
router.put("/contacts/:id", updateOneContact);
router.delete("/contacts/:id", deleteContact);

module.exports = router;
