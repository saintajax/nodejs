const mongoose = require("mongoose");
const SchemaTypes = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
    required: [true, "missing field favorite"],
  },
  owner: {
    type: SchemaTypes.ObjectId,
    ref: "user",
  },
});

const Contact = new mongoose.model("contact", contactSchema);

module.exports = Contact;
