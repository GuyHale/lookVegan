const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

// defining a method to protect app from client-side cross scripting
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

//creating a validation Joi schema, i can run req.body through this schema
//and it will evaluate whether or not the elements in req.body match their
//related requirements
module.exports.placeSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(30)
        .escapeHTML()
        .required(),

    city: Joi.string()
        .escapeHTML()
        .required(),

    option1: Joi.string()
        .escapeHTML()
        .required(),

    option2: Joi.string()
        .escapeHTML()
        .required(),

    option3: Joi.string()
        .escapeHTML()
        .required(),

    price1: Joi.number()
        .min(0)
        .required(),

    price2: Joi.number()
        .min(0)
        .required(),

    price3: Joi.number()
        .min(0)
        .required(),

    des: Joi.string()
        .escapeHTML()
        .max(50)
        .required(),

    deleteImages: Joi.array()

    // images: Joi.string()
    //     .required()
});


module.exports.reviewSchema = Joi.object({
    rating: Joi.number()
        .min(0)
        .max(5)
        .required(),

    body: Joi.string()
        .min(10)
        .required()




})