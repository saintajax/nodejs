const Contact = require("./schemas/contacts");

const getAllContacts = (owner, { skip, limit }) => {
  return Contact.find({ owner }).populate("owner").skip(skip).limit(limit);
};

const getContactById = (id, owner) => {
  return Contact.findOne({ _id: id, owner });
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

const updateContact = (id, fields, owner) => {
  return Contact.findOneAndUpdate({ _id: id, owner }, fields, { new: true });
};

const removeContact = (id, owner) => {
  return Contact.findOneAndDelete({ _id: id, owner });
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
};
