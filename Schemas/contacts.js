const Joi = require("joi");
    
const addContactSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(8).required()
})

module.exports = addContactSchema;