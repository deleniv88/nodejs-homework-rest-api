
const mongoose = require("mongoose");

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
},{
  versionKey: false
})

const Contact = mongoose.model("contacts", schema)

const listContacts = async () => {
  try {
    const dbRaw = await Contact.find({});
    return dbRaw;
  } catch (error) {
    console.error(error);
  }
const fs = require('fs/promises')
const path = require("path");

const constactsPath = path.resolve(__dirname, "./contacts.json");

const { nanoid } = require("nanoid");

const listContacts = async () => {
  try {
    const dbRaw = await fs.readFile(constactsPath, "utf-8");
    const db = JSON.parse(dbRaw)
    return db;
} catch (error) {
    console.error(error);
}
}

const getContactById = async (contactId) => {
  try {
    const searchById = Contact.findById(contactId)
    return searchById;
  } catch (error) {
    console.error(error);
  }
    const db = await listContacts();
    const searchById = db.find(({ id }) => `${id}` === `${contactId}`);
    return searchById;
} catch (error) {
    console.error(error);
}
}

const removeContact = async (contactId) => {
  try {
    const searchById = await Contact.findById(contactId)
    await Contact.findByIdAndRemove(searchById)
  } catch (error) {
    console.error();
  }
}

const addContact = async (body) => {
  try {
      const contact = await Contact.create({
        ...body,
      })
      return contact
   
  } catch (error) {
    console.error(error);
  }
}

const updateContact = async (contactId, body) => {
  try {
    const contactUpdate = await Contact.findById(contactId);
    return await Contact.findByIdAndUpdate(contactUpdate, {...body}, {new: true})

  } catch (error) {
    console.error(error.message);
  }
}

const updateStatusContact = async (contactId, body) => {
  try {
      const contactUpdate = await Contact.findById(contactId);
      return await Contact.findByIdAndUpdate(contactUpdate, {...body}, {new: true})
  } catch (error) {
    console.error(error.message)
    const db = await listContacts();

    const updateDB = db.filter((contact) => contact.id !== contactId)
    await writeDB(updateDB)
} catch (error) {
    console.error();
}
}

async function writeDB(db) {
  try {
      await fs.writeFile(constactsPath, JSON.stringify(db, null, 4))
  } catch (error) {
      console.error(error);
  }
}

const addContact = async (body) => {
  try {
    const id = nanoid();
    const db = await listContacts();

    const contact = { id, ...body }

    db.push(contact)

    await writeDB(db)
    return contact;

} catch (error) {
    console.error(error);
}
}

const updateContact = async (contactId, body) => {
  try {
    const db = await listContacts();
    const contactIndex = db.findIndex(({id}) => id.toString() === contactId);
    
    if(contactIndex === -1) return;
    db[contactIndex] = {...db[contactIndex],...body}
    
    await writeDB(db)
    return db[contactIndex]

  } catch (error) {
    console.error(error.message);
  }
}

module.exports = {
  Contact,
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact
}