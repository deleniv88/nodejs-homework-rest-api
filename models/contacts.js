const { mongoose, SchemaTypes } = require("mongoose");

const schema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
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
  },
  owner: {
    type: SchemaTypes.ObjectId,
    ref: 'users',
  }
}, {
  timestamps: true,
  versionKey: false
});

const Contact = mongoose.model("contacts", schema);

const listContacts = async (usersId, { favorite, page, limit }) => {
  try {
    const searchUser = { owner: usersId };
    const dbRaw = await Contact.find(searchUser)
      .skip(page)
      .limit(limit)
      .populate({ path: "owner" });
    return dbRaw;
  } catch (error) {
    console.error(error);
  }
}

const getContactById = async (contactId) => {
  try {
    const searchById = Contact.findById(contactId);
    return searchById;
  } catch (error) {
    console.error(error);
  }
}

const removeContact = async (contactId) => {
  try {
    const searchById = await Contact.findById(contactId);
    await Contact.findByIdAndRemove(searchById);
  } catch (error) {
    console.error();
  }
}

const addContact = async (body) => {
  try {
    const contact = await Contact.create({
      ...body,
    })
    return contact;
  } catch (error) {
    console.error(error);
  }
}

const updateContact = async (contactId, body) => {
  try {
    const contactUpdate = await Contact.findById(contactId);
    return await Contact.findByIdAndUpdate(contactUpdate, { ...body }, { new: true });
  } catch (error) {
    console.error(error.message);
  }
}

const updateStatusContact = async (contactId, body) => {
  try {
    const contactUpdate = await Contact.findById(contactId);
    return await Contact.findByIdAndUpdate(contactUpdate, { ...body }, { new: true });
  } catch (error) {
    console.error(error.message)
  }
}

module.exports = {
  Contact,
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
}