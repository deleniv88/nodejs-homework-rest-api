const express = require('express');
const router = express.Router();

const { getAllContacts, getContact, createContact, deleteContact, updContact } = require('../../controllers/contacts.controller');
const validateBody = require('../../middelwares');
const addContactSchema = require('../../schemas/contacts');

router.get('/', getAllContacts)
router.get('/:contactId', getContact)
router.post('/', validateBody(addContactSchema), createContact)
router.delete('/:contactId', deleteContact)
router.put('/:contactId', validateBody(addContactSchema), updContact)

module.exports = router
