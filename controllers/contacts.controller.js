const { listContacts, getContactById, addContact, removeContact, updateContact } = require('../models/contacts')

async function getAllContacts(req, res, next) {
    res.status(200).json(await listContacts())
}

async function getContact(req, res, next) {
    const { contactId } = req.params;
    const contact = await getContactById(contactId)

    if (contact) {
        return res.status(200).json(contact)
    }
    return res.status(404).json({ message: 'Not found' })
}

async function createContact(req, res, next) {
    const body = req.body;
    const newContact = await addContact(body);
    res.status(201).json(newContact)
}

async function deleteContact(req, res, next) {

    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
        return next(res.status(404).json({ message: "Not found" }))
    }
    await removeContact(contactId)
    return res.status(200).json({ message: "contact deleted" })
}

async function updContact(req, res, next) {

    if (req.body) {
        const newContact = await updateContact(req.params.contactId, req.body);

        if (newContact) {
            return res.status(200).json({
                data: newContact
            })
        } else {
            res.status(404).json({ message: "Not found" })
        }
    }
}

module.exports = {
    getAllContacts,
    getContact,
    createContact,
    deleteContact,
    updContact
}
