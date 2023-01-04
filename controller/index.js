const service = require("../service");

const listContacts = async (_, res, next) => {
  try {
    const contacts = await service.getAllContacts();
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
    const contact = await service.getContactById(id);
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
  const newContact = req.body;
  try {
    const updatedContact = await service.updateContact(id, newContact);
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
  const favorite = req.body;
  if (!favorite) {
    res.json({
      status: "error",
      code: 400,
      data: { message: "missing field favorite" },
    });
  }
  try {
    const updatedContact = await service.updateContact(id, newContact);
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
    const result = await service.removeContact(id);
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
