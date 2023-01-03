const Contact = require("./model");

const listContacts = async (_, res, next) => {
  try {
    const contacts = await Contact.find({});
    console.log(contacts);
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
};

const findContactsById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const contact = await Contact.find().where("id").equals(req.params.id);
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
        message: `Not found contact id: ${id}`,
        data: "Not Found",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const createContact = async (req, res, next) => {
  const newContact = newContact(req.body);
  try {
    if (newContact) {
      await newContact.save();
      res.status(201).json({
        status: "success",
        code: 201,
        data: { newContact },
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
};

const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const newContact = req.body;
  try {
    const updatedContact = await Contact.findByIdAndUpdate(id, newContact, {
      new: true,
    });
    if (updatedContact) {
      res.json({
        status: "success",
        code: 200,
        data: { updatedContact },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: "Not found",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await Contact.findByIdAndRemove(id);
    if (result) {
      res.status(200).json({
        status: "success",
        code: 200,
        message: "contact deleted",
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${req.params.id}`,
        data: "Not Found",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = {
  listContacts,
  findContactsById,
  createContact,
  updateContact,
  deleteContact,
};
