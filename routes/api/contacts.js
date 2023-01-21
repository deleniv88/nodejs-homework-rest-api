const express = require('express');
const router = express.Router();

const { getAllContacts, getContact, createContact, deleteContact, updContact, contactStatus} = require('../../controllers/contacts.controller');

const validateBody = require('../../middelwares');
const addContactSchema = require('../../schemas/contacts');

router.get('/', getAllContacts)
router.get('/:contactId', getContact)
router.post('/', validateBody(addContactSchema), createContact)
router.delete('/:contactId', deleteContact)
router.put('/:contactId', validateBody(addContactSchema), updContact)
router.patch('/:contactId/favorite', contactStatus)

module.exports = router

