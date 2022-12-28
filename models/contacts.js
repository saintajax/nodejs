const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const dbPath = path.resolve("./models/contacts.json");

const listContacts = async () => {
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    return data;
  } catch (err) {
    console.log(err);
  }
};

const getContactById = async (contactId) => {
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    const [contact] = JSON.parse(data).filter((el) => el.id === contactId);
    return contact;
  } catch (error) {
    console.log(error);
  }
};

const removeContact = async (contactId) => {
  let isExist = false;

  try {
    const data = await fs.readFile(dbPath, "utf-8");
    const newContacts = JSON.parse(data).filter((el) => {
      if (el.id === contactId) {
        isExist = true;
      }
      return el.id !== contactId;
    });
    if (!isExist) {
      return;
    }
    fs.writeFile(dbPath, JSON.stringify(newContacts));
    return contactId;
  } catch (error) {
    console.log(error);
  }
};

const addContact = async (body) => {
  const { name, email, phone } = body;
  const isValid = name && email && phone;
  if (!isValid) {
    return;
  }
  const contact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    const newContacts = [...JSON.parse(data), contact];
    fs.writeFile(dbPath, JSON.stringify(newContacts));
    return contact;
  } catch (error) {
    console.log(error);
  }
};

const updateContact = async (contactId, body) => {
  const { name, email, phone } = body;
  let isExist = "No";
  const contact = {
    id: contactId,
    name,
    email,
    phone,
  };
  const isValid = name && email && phone;
  if (!isValid) {
    return;
  }

  try {
    const data = await fs.readFile(dbPath, "utf-8");
    const newContacts = JSON.parse(data).map((el) => {
      if (el.id === contactId) {
        isExist = "Yes";
      }
      return el.id === contactId ? contact : el;
    });
    if (isExist === "No") {
      return "No";
    }
    await fs.writeFile(dbPath, JSON.stringify(newContacts));
    return contact;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
