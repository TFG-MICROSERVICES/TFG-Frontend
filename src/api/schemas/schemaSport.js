import Joi from 'joi';

export const sportSchema = Joi.object({
    name: Joi.string().max(255).required().messages({
        'string.base': 'El nombre del deporte debe ser una cadena de texto',
        'string.max': 'El nombre del deporte debe tener máximo 255 caracteres',
        'string.empty': 'El nombre del deporte es obligatorio',
    }),
    description: Joi.string().allow(null, '').messages({
        'string.base': 'La descripción del deporte debe ser una cadena de texto',
        'string.max': 'La descripción del deporte debe tener máximo 255 caracteres',
        'string.empty': 'La descripción del deporte es obligatoria',
    }),
    status: Joi.boolean().required().messages({
        'any.required': 'El estado del deporte es requerido',
        'boolean.base': 'El estado del deporte debe ser un booleano',
    }),
    image: Joi.string().allow(null, '').messages({
        'string.base': 'La imagen del deporte debe ser una cadena de texto',
    }),
    minimum_players: Joi.number().required().messages({
        'any.required': 'La cantidad mínima de jugadores es requerida',
        'number.base': 'La cantidad mínima de jugadores debe ser un número',
    }),
});
