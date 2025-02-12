import Joi from 'joi';

export const sportSchema = Joi.object({
    name: Joi.string().max(255).required().messages({
        'any.required': 'name is required',
        'string.base': 'name must be string',
        'string.max': 'name must be at most 255 characters',
    }),
    description: Joi.string().allow(null,"").messages({
        'any.required': 'description is required',
        'string.base': 'description must be string',
    }),
    status: Joi.boolean().default(false).required().messages({
        'any.required': 'status is required',
        'boolean.base': 'status must be boolean',
    }),
    image: Joi.string().allow(null,"").messages({
        'string.base': 'image must be string',
    }),
    minimum_players: Joi.number().required().messages({
        'any.required': 'minimum_players is required',
        'number.base': 'minimum_players must be number',
    }),
});