const { listContacts, getContactById, addContact, removeContact, updateContact } = require("../models/contacts");

async function getAllContacts(req, res, next) {
    const usersId = req.user;
    const { page = 1, limit = 10, favorite} = req.query;
    const skip = (page - 1) * limit;

    const contacts = await listContacts(usersId, {favorite, skip, limit });
    res.json({ status: 'success', code: 200, data: { ...contacts } });}

async function getContact(req, res, next) {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (contact) {
        return res.status(200).json(contact);
    }
    return res.status(404).json({ message: 'Not found' });
}

const createContact = async (req, res, next) => {
    const usersId = req.user._id;
    const contact = await addContact({ ...req.body, owner: usersId });
    res.status(201).json({ status: 'success', code: 202, data: { contact } });
  };
  

async function deleteContact(req, res, next) {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
        return next(res.status(404).json({ message: "Not found" }));
    }
    await removeContact(contactId);
    return res.status(200).json({ message: "contact deleted" });
}

async function updContact(req, res, next) {

    if (req.body) {
        const newContact = await updateContact(req.params.contactId, req.body);

        if (newContact) {
            return res.status(200).json({
                data: {...newContact},
                status: "success"
            })
        } else {
            res.status(404).json({ message: "Not found" });
        }
    }
}

async function contactStatus(req, res, next) {
    if (!Object.keys(req.body).length) {
        return res.status(400).json({
            message: "missing fields favorite",
        });
    }

    const newContact = await updateContact(req.params.contactId, req.body);

    if (!newContact) {
        res.status(400).json({
            message: "Not found",
        });
    } res.status(200).json({ data: newContact, status: "success" });
}

module.exports = {
    getAllContacts,
    getContact,
    createContact,
    deleteContact,
    updContact,
    contactStatus,
}