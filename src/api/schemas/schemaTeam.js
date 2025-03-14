import Joi from 'joi';

export const teamSchema = Joi.object({
    name: Joi.string().max(255).required().messages({
        'any.required': 'El nombre es requerido',
        'string.base': 'El nombre debe ser una cadena',
        'string.max': 'El nombre debe tener máximo 255 caracteres',
    }),
    sport_id: Joi.string().max(255).required().messages({
        'any.required': 'El ID del deporte es requerido',
        'string.base': 'El ID del deporte debe ser una cadena',
        'string.max': 'El ID del deporte debe tener máximo 255 caracteres',
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
