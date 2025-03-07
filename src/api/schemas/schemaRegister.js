import Joi from 'joi';

export const userSchema = Joi.object({
    main_sport_id: Joi.number().integer().allow(null).messages({
        'number.base': 'El deporte principal debe ser un número',
        'number.integer': 'El deporte principal debe ser un número entero',
    }),
    email: Joi.string().required().email({ tlds: false }).max(255).messages({
        'string.empty': 'El correo electrónico es obligatorio',
        'string.email': 'El correo electrónico debe ser un email válido',
    }),
    password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*._]).+$')).required().messages({
        'string.empty': 'La contraseña es obligatoria',
        'string.base': 'La contraseña debe ser un texto',
        'string.min': 'La contraseña debe tener al menos 8 caracteres',
        'string.pattern.base': 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial',
    }),
    password_confirm: Joi.string().valid(Joi.ref('password')).required().messages({
        'string.empty': 'La confirmación de contraseña es obligatoria',
        'string.base': 'La contraseña debe ser un texto',
        'any.only': 'Las contraseñas no coinciden',
    }),
    name: Joi.string().max(255).required().messages({
        'string.empty': 'El nombre es obligatorio',
        'string.base': 'El nombre debe ser un texto',
        'string.max': 'El nombre debe tener como máximo 255 caracteres',
    }),
    lastName: Joi.string().max(255).required().messages({
        'string.empty': 'Los apellidos son obligatorios',
        'string.base': 'Los apellidos deben ser un texto',
        'string.max': 'Los apellidos deben tener como máximo 255 caracteres',
    }),
    image_profile: Joi.string().allow(null, '').messages({
        'string.base': 'La imagen de perfil debe ser un texto',
    }),
    phone_number: Joi.string().max(20).allow(null, '').messages({
        'string.base': 'El número de teléfono debe ser un texto',
        'string.max': 'El número de teléfono debe tener como máximo 20 caracteres',
    }),
    birthdate: Joi.date().required().messages({
        'string.empty': 'La fecha de nacimiento es obligatoria',
        'date.base': 'La fecha de nacimiento debe ser una fecha válida',
    }),
    city: Joi.string().max(255).required().messages({
        'string.empty': 'La ciudad es obligatoria',
        'string.base': 'La ciudad debe ser un texto',
        'string.max': 'La ciudad debe tener como máximo 255 caracteres',
    }),
    autonomous_region: Joi.string().max(255).required().messages({
        'any.required': 'El país es obligatorio',
        'string.base': 'El país debe ser un texto',
        'string.max': 'El país debe tener como máximo 255 caracteres',
    }),
});
