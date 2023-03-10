const service = require("../service/contacts");

const listContacts = async (req, res, next) => {
  const { _id } = req.user;
  const { skip = 0, limit = 5 } = req.query;
  try {
    const contacts = await service.getAllContacts(_id, { skip, limit });
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
  const { _id } = req.user;
  try {
    const contact = await service.getContactById(id, _id);
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
  const newContact = req.body;
  newContact.owner = req.user._id;
  try {
    if (newContact) {
      await service.createContact(newContact);
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

const updateOneContact = async (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.user;
  const newContact = req.body;
  try {
    const updatedContact = await service.updateContact(id, newContact, _id);
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

const updateFavorit = async (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.user;
  const favorite = req.body;
  if (!favorite) {
    res.json({
      status: "error",
      code: 400,
      data: { message: "missing field favorite" },
    });
  }
  try {
    const updatedContact = await service.updateContact(id, newContact, _id);
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
  const { _id } = req.user;
  try {
    const result = await service.removeContact(id, _id);
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
  updateOneContact,
  updateFavorit,
  deleteContact,
};
