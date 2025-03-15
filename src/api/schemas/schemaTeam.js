import Joi from 'joi';

export const teamSchema = Joi.object({
    name: Joi.string().max(255).required().messages({
        'any.required': 'El nombre es requerido',
        'string.base': 'El nombre debe ser una cadena',
        'string.max': 'El nombre debe tener máximo 255 caracteres',
    }),
    sport_id: Joi.number().required().messages({
        'any.required': 'El ID del deporte es requerido',
        'number.base': 'El ID del deporte debe ser un número',
    }),
    public: Joi.boolean().default(true).required().messages({
        'any.required': 'El campo público es requerido',
        'boolean.base': 'El campo público debe ser un booleano',
    }),
});

export const updateSchema = Joi.object({
    name: Joi.string().max(255).required().messages({
        'any.required': 'El nombre es requerido',
        'string.base': 'El nombre debe ser una cadena',
        'string.max': 'El nombre debe tener máximo 255 caracteres',
    }),
    public: Joi.boolean().default(true).allow(null, true, false).messages({
        'any.required': 'El campo público es requerido',
        'boolean.base': 'El campo público debe ser un booleano',
    }),
});
