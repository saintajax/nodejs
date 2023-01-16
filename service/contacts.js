const Contact = require("./schemas/contacts");

const getAllContacts = (owner) => {
  return Contact.find({ owner }).populate("owner");
};

const getContactById = (id) => {
  return Contact.findOne({ _id: id });
};

const createContact = ({
  name,
  email = "notDefind",
  phone = "notDefind",
  owner,
}) => {
  const newContact = { name, email, phone, favorite: false, owner };
  return Contact.create(newContact);
};

const updateContact = (id, fields) => {
  return Contact.findByIdAndUpdate({ _id: id }, fields, { new: true });
};

const removeContact = (id) => {
  return Contact.findByIdAndRemove({ _id: id });
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
};
