const express = require("express");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts.js");

const router = express.Router();

router.get("/", async (_, res, next) => {
  try {
    const contacts = await listContacts();
    res.json({
      status: "success",
      code: 200,
      data: {
        contacts,
      },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await getContactById(contactId);
    if (contact) {
      res.json({
        status: "success",
        code: 200,
        data: { contact },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${contactId}`,
        data: "Not Found",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const contact = await addContact(req.body);
    if (contact) {
      res.status(201).json({
        status: "success",
        code: 201,
        data: { contact },
      });
    } else {
      res.status(400).json({
        status: "error",
        code: 400,
        message: "missing required name field",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const contact = await removeContact(req.params.contactId);
    if (contact !== undefined) {
      res.status(200).json({
        status: "success",
        code: 200,
        message: "contact deleted",
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${req.params.contactId}`,
        data: "Not Found",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = req.body;
  try {
    const newContact = await updateContact(contactId, contact);
    if (newContact && newContact !== "No") {
      res.json({
        status: "success",
        code: 200,
        data: { newContact },
      });
    } else if (newContact === "No") {
      res.status(404).json({
        status: "error",
        code: 404,
        message: "Not found",
      });
    } else {
      res.status(400).json({
        status: "error",
        code: 400,
        message: "missing field",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
