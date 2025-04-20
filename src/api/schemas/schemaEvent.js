import Joi from 'joi';

export const eventSchema = Joi.object({
    sport_id: Joi.number().required().messages({
        'number.empty': 'El ID del deporte no puede estar vacío',
        'any.required': 'El ID del deporte es requerido',
    }),

    name: Joi.string().max(255).required().messages({
        'string.empty': 'El nombre del evento es requerido',
        'string.max': 'El nombre del evento no puede exceder los 255 caracteres',
    }),

    description: Joi.string().allow(null, '').messages({
        'string.base': 'La descripción debe ser texto',
    }),

    event_type: Joi.string().required().valid('single', 'tournament', 'league').messages({
        'string.empty': 'El tipo de evento es requerido',
        'any.only': 'El tipo de evento debe ser: single, tournament o league',
    }),

    status: Joi.string().valid('0', '1', '2').default('1').messages({
        'string.empty': 'El estado no puede estar vacío',
        'any.only': 'El estado debe ser: 0, 1 o 2',
    }),

    location: Joi.string().max(255).required().messages({
        'string.empty': 'La ubicación es requerida',
        'string.max': 'La ubicación no puede exceder los 255 caracteres',
    }),

    start_time: Joi.date().required().min('now').messages({
        'date.base': 'La fecha de inicio debe ser una fecha válida',
        'date.min': 'La fecha de inicio debe ser superior a la fecha de hoy',
        'any.required': 'La fecha de inicio es requerida',
    }),

    end_time: Joi.date().required().min('now').greater(Joi.ref('start_time')).messages({
        'date.base': 'La fecha de fin debe ser una fecha válida',
        'date.greater': 'La fecha de fin debe ser posterior a la fecha de inicio',
        'date.min': 'La fecha de fin debe ser superior a la fecha de hoy',
        'any.required': 'La fecha de fin es requerida',
    }),

    registration_start: Joi.date().required().min('now').less(Joi.ref('start_time')).messages({
        'date.base': 'La fecha de inicio de registro debe ser una fecha válida',
        'date.less': 'La fecha de inicio de registro debe ser anterior a la fecha de inicio del evento',
        'date.min': 'La fecha de inicio de registro debe ser superior a la fecha de hoy',
        'any.required': 'La fecha de inicio de registro es requerida',
    }),

    registration_end: Joi.date().required().min('now').greater(Joi.ref('registration_start')).less(Joi.ref('start_time')).messages({
        'date.base': 'La fecha de fin de registro debe ser una fecha válida',
        'date.greater': 'La fecha de fin de registro debe ser posterior a la fecha de inicio de registro',
        'date.less': 'La fecha de fin de registro debe ser anterior a la fecha de inicio del evento',
        'date.min': 'La fecha de fin de registro debe ser superior a la fecha de hoy',
        'any.required': 'La fecha de fin de registro es requerida',
    }),
});

export const updateEventSchema = Joi.object({
    sport_id: Joi.string().max(255).required().messages({
        'string.empty': 'El ID del deporte no puede estar vacío',
        'string.max': 'El ID del deporte no puede exceder los 255 caracteres',
        'any.required': 'El ID del deporte es requerido',
    }),

    name: Joi.string().max(255).required().messages({
        'string.empty': 'El nombre del evento no puede estar vacío',
        'string.max': 'El nombre del evento no puede exceder los 255 caracteres',
        'any.required': 'El nombre del evento es requerido',
    }),

    description: Joi.string().allow(null, ''),

    event_type: Joi.string().valid('single', 'tournament', 'league').required().messages({
        'string.empty': 'El tipo de evento no puede estar vacío',
        'any.only': 'El tipo de evento debe ser: single, tournament o league',
        'any.required': 'El tipo de evento es requerido',
    }),

    status: Joi.string().valid('0', '1', '2').default('1').messages({
        'string.empty': 'El estado no puede estar vacío',
        'any.only': 'El estado debe ser: 0, 1 o 2',
    }),

    location: Joi.string().max(255).allow(null, '').messages({
        'string.max': 'La ubicación no puede exceder los 255 caracteres',
    }),

    start_time: Joi.date().allow(null).min('now').messages({
        'date.base': 'La fecha de inicio debe ser una fecha válida',
        'date.min': 'La fecha de inicio debe ser superior a la fecha de hoy',
    }),

    end_time: Joi.date().allow(null).min('now').greater(Joi.ref('start_time')).messages({
        'date.base': 'La fecha de fin debe ser una fecha válida',
        'date.greater': 'La fecha de fin debe ser posterior a la fecha de inicio',
        'date.min': 'La fecha de fin debe ser superior a la fecha de hoy',
    }),

    registration_start: Joi.date().allow(null).min('now').less(Joi.ref('start_time')).messages({
        'date.base': 'La fecha de inicio de registro debe ser una fecha válida',
        'date.less': 'La fecha de inicio de registro debe ser anterior a la fecha de inicio del evento',
        'date.min': 'La fecha de inicio debe ser superior a la fecha de hoy',
    }),

    registration_end: Joi.date().allow(null).min('now').greater(Joi.ref('registration_start')).less(Joi.ref('start_time')).messages({
        'date.base': 'La fecha de fin de registro debe ser una fecha válida',
        'date.greater': 'La fecha de fin de registro debe ser posterior a la fecha de inicio de registro',
        'date.less': 'La fecha de fin de registro debe ser anterior a la fecha de inicio del evento',
        'date.min': 'La fecha de fin de registro debe ser superior a la fecha de hoy',
    }),
});
