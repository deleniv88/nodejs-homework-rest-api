const express = require('express');
const router = express.Router();

const { getAllContacts, getContact, createContact, deleteContact, updContact, contactStatus} = require('../../controllers/contacts.controller');

const {validateBody} = require('../../middelwares/index');
const {auth} = require('../../middelwares/auth');

const addContactSchema = require('../../schemas/contacts');
const { tryCatchWrapper } = require('../../helpers');

router.get('/', tryCatchWrapper(auth), getAllContacts)
router.get('/:contactId', getContact);
router.post('/',  tryCatchWrapper(auth), createContact)
router.delete('/:contactId', deleteContact)
router.put('/:contactId', validateBody(addContactSchema), updContact)
router.patch('/:contactId/favorite', contactStatus);

module.exports = router

